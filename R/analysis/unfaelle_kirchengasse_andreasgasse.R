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
# unfall daten ----
# ++++++++++++++++++++++++++++++

path_data <- "/Users/rk/Library/Mobile Documents/com~apple~CloudDocs/geodata/österreich/wien/Unfälle/Statistik Austria 17.10.2025/2013_2024_WienNEU1610.csv"
geo_data_raw <- read.delim(path_data, sep = "\t") %>%
  mutate(
    across(contains("WGS84"), ~ as.numeric(str_replace_all(.x, ",", ".")))
  ) %>%
  st_as_sf(coords = c("U_WGS84X", "U_WGS84Y"), crs = 4326) %>%
  st_transform(31287)

# only bycicle accidents
geo_bike_accidents_vienna <- geo_data_raw %>%
  filter(str_detect(BETEILIGUNG, "Fahrrad|E-Bike|E-Scooter"))

# ++++++++++++++++++++++++++++++
# andreasgasse ----
# ++++++++++++++++++++++++++++++
path_kirch_andreas <- here("data_output/kirchengasse_to_andreasgasse_dissolved.gpkg")
geo_buf_kirch_andreas <- read_sf(path_kirch_andreas)

# ++++++++++++++++++++++++++++++
# bike accidents in that areas ----
# ++++++++++++++++++++++++++++++
geo_bike_kirch_andreas <- geo_bike_accidents_vienna[geo_buf_kirch_andreas, ]

# ++++++++++++++++++++++++++++++
# per year ----
# ++++++++++++++++++++++++++++++
d_unf_kirch_andreas_per_year <- geo_bike_kirch_andreas %>%
  st_drop_geometry() %>%
  count(JAHR) %>%
  complete(JAHR = full_seq(JAHR, 1)) %>%
  replace_na(list(n = 0))

dw_data_to_chart(d_unf_kirch_andreas_per_year, "EAtnR")
