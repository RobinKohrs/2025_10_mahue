library(tidyverse)
library(here)
library(sf)
library(shadowtext)

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
geo_mh_buff_13m <- st_buffer(geo_mh_line, 13) %>% summarise()

# create near zone (1km buffer without the street)
geo_mh_buff_1km <- st_buffer(geo_mh_buff_13m, 1000)
geo_mh_buff_near <- st_difference(geo_mh_buff_1km, geo_mh_buff_13m)


# ++++++++++++++++++++++++++++++
# analyse ----
# ++++++++++++++++++++++++++++++

# accidents on the mh by time of day and weekday
unfaelle_on_mh_by_time <- geo_unfaelle_bike %>%
  st_filter(geo_mh_buff_13m) %>%
  st_drop_geometry() %>%
  count(UHRZEIT, WOCHENTAG, name = "n") %>%
  mutate(region = "On Mariahilferstr.")

# accidents near the mh by time of day and weekday
unfaelle_near_mh_by_time <- geo_unfaelle_bike %>%
  st_filter(geo_mh_buff_near) %>%
  st_drop_geometry() %>%
  count(UHRZEIT, WOCHENTAG, name = "n") %>%
  mutate(region = "Near Mariahilferstr.")

# accidents in rest of vienna by time of day and weekday
unfaelle_vienna_by_time <- geo_unfaelle_bike %>%
  st_filter(geo_mh_buff_13m, .predicate = st_disjoint) %>%
  st_filter(geo_mh_buff_near, .predicate = st_disjoint) %>%
  st_drop_geometry() %>%
  count(UHRZEIT, WOCHENTAG, name = "n") %>%
  mutate(region = "Rest of Vienna")

# combine data
all_accidents_by_time_weekday <- bind_rows(
  unfaelle_on_mh_by_time,
  unfaelle_near_mh_by_time,
  unfaelle_vienna_by_time
)

# Translate weekdays to German and order factors for plotting
time_order <- c(
  "0 bis 6 Uhr",
  "6 bis 9 Uhr",
  "9 bis 12 Uhr",
  "12 bis 15 Uhr",
  "15 bis 18 Uhr",
  "18 bis 24 Uhr"
)
weekday_order_de <- c("Mo", "Di", "Mi", "Do", "Fr", "Sa", "So")

all_accidents_by_time_weekday <- all_accidents_by_time_weekday %>%
  mutate(
    WOCHENTAG = recode(
      WOCHENTAG,
      "Mon" = "Mo",
      "Tue" = "Di",
      "Wed" = "Mi",
      "Thu" = "Do",
      "Fri" = "Fr",
      "Sat" = "Sa",
      "Sun" = "So"
    ),
    UHRZEIT = factor(UHRZEIT, levels = rev(time_order)),
    WOCHENTAG = factor(WOCHENTAG, levels = weekday_order_de)
  )

# ++++++++++++++++++++++++++++++
# plot heatmaps ----
# ++++++++++++++++++++++++++++++

# Plot for "On Mariahilferstr."
plot_on_mh <- all_accidents_by_time_weekday %>%
  filter(region == "On Mariahilferstr.") %>%
  ggplot(aes(x = WOCHENTAG, y = UHRZEIT, fill = n)) +
  geom_tile(color = "white", size = 0.5) +
  geom_shadowtext(
    aes(label = n),
    color = "black",
    bg.color = "white",
    bg.r = 0.05,
    size = 3
  ) +
  coord_equal() +
  scale_fill_viridis_c(option = "plasma", direction = -1) +
  theme_minimal(base_size = 12) +
  labs(
    title = "Unfälle auf der Mariahilfer Straße",
    x = NULL,
    y = NULL,
    fill = "Anzahl Unfälle"
  ) +
  theme(
    plot.title = element_text(face = "bold", size = 16),
    axis.text.x = element_text(angle = 45, hjust = 1)
  )

# Plot for "Near Mariahilferstr."
plot_near_mh <- all_accidents_by_time_weekday %>%
  filter(region == "Near Mariahilferstr.") %>%
  ggplot(aes(x = WOCHENTAG, y = UHRZEIT, fill = n)) +
  geom_tile(color = "white", size = 0.5) +
  geom_shadowtext(
    aes(label = n),
    color = "black",
    bg.color = "white",
    bg.r = 0.05,
    size = 3
  ) +
  coord_equal() +
  scale_fill_viridis_c(option = "plasma", direction = -1) +
  theme_minimal(base_size = 12) +
  labs(
    title = "Unfälle nahe der Mariahilfer Straße (1km Puffer)",
    x = NULL,
    y = NULL,
    fill = "Anzahl Unfälle"
  ) +
  theme(
    plot.title = element_text(face = "bold", size = 16),
    axis.text.x = element_text(angle = 45, hjust = 1)
  )

# Plot for "Rest of Vienna"
plot_vienna <- all_accidents_by_time_weekday %>%
  filter(region == "Rest of Vienna") %>%
  ggplot(aes(x = WOCHENTAG, y = UHRZEIT, fill = n)) +
  geom_tile(color = "white", size = 0.5, show.legend = F) +
  geom_shadowtext(
    aes(label = n),
    color = "black",
    bg.color = "white",
    bg.r = 0.12,
    size = 3
  ) +
  coord_equal() +
  scale_fill_viridis_c(option = "plasma", direction = -1) +
  theme_minimal(base_size = 12) +
  labs(
    title = "Unfälle im Rest von Wien",
    x = NULL,
    y = NULL,
    fill = "Anzahl Unfälle",
    fill = NULL
  ) +
  theme(
    plot.title = element_text(face = "bold", size = 16),
    axis.text.x = element_text(angle = 45, hjust = 1)
  )

# Print the plots
print(plot_on_mh)
print(plot_near_mh)
print(plot_vienna)
