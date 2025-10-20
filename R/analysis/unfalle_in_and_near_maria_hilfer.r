library(tidyverse)
library(here)
library(glue)
library(sf)
library(davR)
library(jsonlite)
library(mapview)
library(DatawRappr)
m <- mapview


# ++++++++++++++++++++++++++++++
# paths to data ----
# ++++++++++++++++++++++++++++++
path_unfaelle <- here("data_output/unfaelle.gpkg")
path_innere_mh <- here("data_output/innere_maria_hilfer.gpkg")

# ++++++++++++++++++++++++++++++
#  load and create  data ----
# ++++++++++++++++++++++++++++++

# UNFALLE ----
geo_unfaelle <- read_sf(path_unfaelle) %>% st_transform(31287)
geo_unfaelle_bike <- geo_unfaelle %>%
  filter(str_detect(BETEILIGUNG, "(?i)fahrrad|e[- ]?bike|scooter"))

# ROIs ----
geo_mh_line <- read_sf(path_innere_mh)

# buffer line
geo_mh_buff_13m <- st_buffer(geo_mh_line, 13) %>% summarise()

# buffer near area
geo_mh_buff_1km <- st_buffer(geo_mh_buff_13m, 1000, singleSide = T)

# ++++++++++++++++++++++++++++++
# analyse ----
# ++++++++++++++++++++++++++++++

# create near zone (1km buffer without the street)
geo_mh_buff_near <- st_difference(geo_mh_buff_1km, geo_mh_buff_13m)

# accidents on the  mh
unfaelle_on_mh <- geo_unfaelle_bike %>%
  st_filter(geo_mh_buff_13m)

unfaelle_on_mh_count <- unfaelle_on_mh %>%
  count(JAHR, name = "accidents_on_mh")

# accidents near the mh
unfaelle_near_mh <- geo_unfaelle_bike %>%
  st_filter(geo_mh_buff_near)

unfaelle_near_mh_count <- unfaelle_near_mh %>%
  count(JAHR, name = "accidents_near_mh")

# accidents in all of vienna
unfaelle_vienna <- geo_unfaelle_bike %>%
  st_filter(geo_mh_buff_1km, .predicate = st_disjoint) %>%
  st_filter(geo_mh_buff_near, .predicate = st_disjoint)

unfaelle_vienna_count <- unfaelle_vienna %>%
  count(JAHR, name = "accidents_vienna")

# plot using mapview
m(unfaelle_on_mh, col.regions = "tomato", lwd = 0) +
  m(unfaelle_near_mh, col.regions = "cornflowerblue", lwd = 0) +
  m(unfaelle_vienna, col.regions = "pink", lwd = 0)


# remove sf class from the data
unfaelle_on_mh <- unfaelle_on_mh_count %>% st_drop_geometry()
unfaelle_near_mh <- unfaelle_near_mh_count %>% st_drop_geometry()
unfaelle_vienna <- unfaelle_vienna_count %>% st_drop_geometry()


accident_counts <- full_join(unfaelle_on_mh, unfaelle_near_mh, by = "JAHR") %>%
  full_join(unfaelle_vienna, by = "JAHR") %>%
  arrange(JAHR)

# view the result
print(accident_counts)


# calculate indexed values for comparison
accident_rates <- accident_counts %>%
  mutate(
    across(
      starts_with("accidents"),
      ~ . / first(.) * 100,
      .names = "{.col}_indexed"
    )
  )

dw_data_to_chart(accident_rates, "1blwP")
dw_data_to_chart(accident_rates, "0tHdu")
