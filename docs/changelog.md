# Changelog of the Desktop Cube Extension


## [Desktop Cube 6](https://github.com/schneegans/Desktop-Cube/releases/tag/v6)

**Release Date:** 2021-12-29

#### New Features

* The transition between workspaces when switching in desktop mode now shows the "cube" as well.
* Added a menu to the preferences dialog with links for bug reporting and donations.

#### Other Enhancements

* The extension's version number is now shown in the title of the preferencs dialog.

#### Bug Fixes

* Fixed a non-critical warning about `-Infinity`.


## [Desktop Cube 5](https://github.com/schneegans/Desktop-Cube/releases/tag/v5)

**Release Date:** 2021-12-12

#### New Features

* A small settings dialog allows adjusting some settings regarding the cube's layout, appearance, and behavior.
* It's now possible re-enable the unfold-to-desktop animation.
* It's now possible to modify some animation times such as from desktop to overview, from overview to app drawer, and between workspaces.

## [Desktop Cube 4](https://github.com/schneegans/Desktop-Cube/releases/tag/v4)

**Release Date:** 2021-12-09

#### Enhancements

* The transition from desktop to overview does not fold / unfold the cube any more.
* Cube-face-position computations has been refactored. There are now constants in the code to reliably specify the gap between adjacent workspaces as well as to stretch the position of the next and previous workspace horizontally. This ensures that the side faces of a four-sided cube are visible from the front.
* This changelog has been added.

#### Bug Fixes
* Fixed overlapping workspaces if there are many workspaces.


## [Desktop Cube 3](https://github.com/schneegans/Desktop-Cube/releases/tag/v3)

**Release Date:** 2021-12-07

* Support for GNOME 41 has been added.



## [Desktop Cube 2](https://github.com/schneegans/Desktop-Cube/releases/tag/v2)

**Release Date:** 2021-12-07

* Re-licensed the code as GPLv3 as this is a requirement for invasive GNOME Shell extensions.


## [Desktop Cube 1](https://github.com/schneegans/Desktop-Cube/releases/tag/v1)

**Release Date:** 2021-12-07

* Initial publication on GitHub supporting GNOME 40.
