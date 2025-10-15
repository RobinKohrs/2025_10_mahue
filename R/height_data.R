library(tidyverse)
library(here)
library(glue)
library(sf)
library(davR)
library(jsonlite)
library(DatawRappr)


data <- read_csv(here("data/sampled_heights.csv")) %>%
  mutate(FOW_NAME = str_replace(FOW_NAME, "^\\d+\\s*-\\s*", "")) %>%
  mutate(
    size = if_else(FOW_NAME == "Ungeteilte Fahrbahn", 1, 10)
  )

dw_data_to_chart(data, "m1QQS")
