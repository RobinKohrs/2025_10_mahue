library(tidyverse)
library(here)
library(glue)
library(sf)
library(davR)
library(jsonlite)

# ++++++++++++++++++++++++++++++
# raw statistik data ----
# ++++++++++++++++++++++++++++++

path_data <- "/Users/rk/Library/Mobile Documents/com~apple~CloudDocs/geodata/österreich/wien/Unfälle/Statistik Austria 17.10.2025/2013_2024_WienNEU1610.csv"
data_raw <- read.delim(path_data, sep = "\t")


data_raw %>%
  count(BETEILIGUNG, JAHR) %>%
  filter(str_detect(BETEILIGUNG, ".Motorfahrrad|Scooter|Bike.*")) %>%
  arrange(JAHR) %>% View()
