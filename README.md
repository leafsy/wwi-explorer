# wwi-explorer
### See history play out in [this interactive explorer](https://kuan9611.github.io/wwi-explorer) of the First World War in Europe.

![Image failed to load](/images/screenshot1.png?raw=true)
![Image failed to load](/images/screenshot2.png?raw=true)

## Overview
One hundred years ago, Europe was embroiled in a conflagration of unprecedented scale. It started with an assassination and ended with the loss of 15 million lives; it gave birth to weapons of unspeakable horror and left behind a generation traumatized by their cruelty; it shattered old empires and from their ashes forged the modern age. The Great War was the [seminal catastrophe](https://www.youtube.com/watch?v=S-wSL4WqUws) of the 20th century, and we can learn much about the world we find ourselves in today by studying events that took place a hundred years prior.  
This project aims to present important events and battles of the war by placing them in time as well as space. It covers the pivotal five years between June 1914 and June 1919 on the European continent, with emphasis placed on military and political history. The project serves mainly as a portal with links to information about the Western, Eastern, Balkan/Macedonian (including Gallipoli) and Italian Fronts.  
_Note: 1914 borders are used throughout the course of the war and may not represent comtemporary demarcations._

## Features
* Zoom in on map for details of cities and national borders
* Scroll, drag, or hit the play button to travel along the timeline
* See the evolution of frontlines and alliances
* Click on event descriptions to get more information
* Change visibility of map layers in the legend
* View important figures and casualties data

## Contribute
The easiest way to contribute to this project is by expanding or updating existing information in the `data` directory. Several data files and their content formats are documented below:
* `events.tsv`: each row is a single-date event that appears on the timeline

  * name - brief description that summarizes event (limit to ~50 characters or less)
  * link - URL to learn more about event (e.g. http://www.history.com/topics/british-history/easter-rising)
  * position - which row on timeline to place event (0/1 for Western Front, 2 for Eastern, 3 for Balkan/Italian)
  * date - date of event in the format _m/d/yyyy_
  * lat/lng (optional) - latitude and longitude where event took place

* `people.tsv`: each row is an important political or military figure during the war

  * name - full name of the historical figure
  * title - role of the person in the war (_German general_, _French prime minister_, etc.)
  * link - URL to learn more about the person (for consistency, use http://www.firstworldwar.com/bio/)
  * start - start date of the person's involvement (use _1/1/1914_ if involved from the start)
  * end - end date of the person's involvement (use _1/1/1920_ if involved until the end)
  * is_allies - 1 if person is on the Entente side, 0 otherwise

* `battles.geojson`: each object in the `features` list is a battle that appears on both timeline and map

  ~~~~
  {
    "type": "Feature",
    "properties": {
      "name": "Battle of Verdun",                                       // name of the battle
      "start": "2/21/1916",                                             // start date
      "end": "12/18/1916",                                              // end date
      "position": 1,                                                    // same as in events.tsv
      "link": "https://en.wikipedia.org/wiki/Battle_of_Verdun"          // URL to learn more
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[...]]                                            // list of lng-lat pairs
    }
  }
  ~~~~

For bugs and/or feature requests, feel free to add a new issue.

## Credits
* [firstworldwar.com](http://www.firstworldwar.com/)
* history.com's [This Day in History](http://www.history.com/this-day-in-history) series
* [National WWI Museum](https://www.theworldwar.org/)
* The History Place's [timeline of the war](http://www.historyplace.com/worldhistory/firstworldwar/)
* ["World War I: Every Day"](https://www.youtube.com/watch?v=-wGQGEOTf4E) by EmperorTigerstar
* [Monthly casualty dataset](https://www.r-bloggers.com/ww1-monthly-casualties-by-fronts-and-belligerents/) compiled by Sam Weiss
* [GeoJSON data of Europe in 1914](https://team.carto.com/u/matallo/tables/europe_1914/public) by Carlos Matallín
* [World Cities Database](http://simplemaps.com/data/world-cities), with coordinates
* Various Wikipedia articles

## License
Copyright 2017 Xiaokai Ye. MIT License (see LICENSE for details).

### Inspired by [EmperorTigerstar](https://www.youtube.com/user/EmperorTigerstar)'s videos and made possible by [D3.js](https://d3js.org/)
