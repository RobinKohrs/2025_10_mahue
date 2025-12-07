# Load required packages
library(here)
library(tidyverse)
library(sf)
library(glue)
library(httr)
library(cli)
library(davR)
library(terra)

# ++++++++++++++++++++++++++++++
# load data ----
# ++++++++++++++++++++++++++++++
path_data <- "/Users/rk/Library/Mobile Documents/com~apple~CloudDocs/geodata/österreich/wien/Unfälle/Statistik Austria 17.10.2025/2013_2024_WienNEU1610.csv"
data_raw <- read.delim(path_data, sep = "\t") %>%
  mutate(
    across(contains("WGS84"), ~ as.numeric(str_replace_all(.x, ",", ".")))
  ) %>%
  st_as_sf(coords = c("U_WGS84X", "U_WGS84Y"), crs = 4326)

# ++++++++++++++++++++++++++++++
# write out ----
# ++++++++++++++++++++++++++++++
path_out <- sys_make_path(here("data_output/unfaelle.gpkg"))
write_sf(data_raw, path_out)


# ++++++++++++++++++++++++++++++
# count MH ----
# ++++++++++++++++++++++++++++++
geo_mh <- st_read("/Users/rk/projects/dst/2025/10/2025-10-mahue-unfaelle/data_output/innere_maria_hilfer.gpkg") %>%
  st_buffer(13) %>%
  st_transform(4326) %>%
  summarise()


geo_unf_mh <- st_intersection(data_raw, geo_mh)


# find bicycle accidents

unique(geo_unf_mh$BETEILIGUNG) %>% dput() %>% clipr::write_clip()

geo_unf_mh %>%
  st_drop_geometry() %>%
  filter(str_detect(BETEILIGUNG, "Fahrrad|E-Bike|E-Scooter")) %>%
  count(BETEILIGUNG, sort = T)
