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
path_data <- "/Users/rk/Library/Mobile Documents/com~apple~CloudDocs/geodata/österreich/wien/Unfälle/Statistik Austria 7.10.2025 /2013_2024_Wien.csv"
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
# some checks ----
# ++++++++++++++++++++++++++++++
data_raw %>%
  st_drop_geometry() %>%
  count(BETEILIGUNG, JAHR, sort = T) %>%
  filter(str_detect(BETEILIGUNG, "E-Bike|Fahrrad"))
