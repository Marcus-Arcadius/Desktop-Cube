<p align="center">
  <img src ="docs/pics/teaser.gif" />
</p>

# Desktop Cube for GNOME Shell

  <a href="https://github.com/Schneegans/Desktop-Cube/actions"><img src="https://github.com/Schneegans/Desktop-Cube/workflows/Checks/badge.svg?branch=main" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-GPLv3-blue.svg?labelColor=303030" /></a>
  <a href="https://extensions.gnome.org/extension/4648/desktop-cube/"><img src="https://img.shields.io/badge/Download-extensions.gnome.org-e67f4d.svg?logo=gnome&logoColor=lightgrey&labelColor=303030" /></a>


When I started using Linux more than a decade ago, it was because of the 3D desktop cube of Compiz.
Even if this was a pretty useless feature, I am still missing it today.
As we already have the awesome [Compiz-alike windows efffects](https://extensions.gnome.org/extension/2950/compiz-alike-windows-effect/), I thought it was time to revive 3D workspaces as well!

## :construction: This is under Construction!

Here's a rough list of thing which might be added in the future, roughly sorted by importance. For a list of things changed in previous releases, you can have a look at the [changelog](docs/changelog.md)!

- [ ] Free rotation of the cube with the middle mouse button.
- [ ] A settings dialog. The opacity of the workspaces, their spacing, and several other things could be configurable.
- [ ] Adjust animation speed of workspace switches and entering / leaving overview and app grid (#1).
- [ ] Proper support for multiple monitors (it may work already, I just haven't tested it).
- [ ] Sky boxes!
- [ ] Automated CI tests.
- [ ] Cuboid transitions when switching workspaces via <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Arrow</kbd>.
- [ ] Switch workspaces while moving a window with pressed <kbd>Alt</kbd> modifier (not sure if that's possible, though).

## :exploding_head: Frequently asked Questions

#### Does this extension increase my productivity?

No.

#### Does this extension increase the performance of GNOME Shell?

Certainly not. But the impact is not so bad after all.

#### Will this extension break if GNOME Shell is updated?

Most likely. The implementation is pretty hacky and relies on some specific internals of GNOME Shell. But maybe we will be able to keep it running....

#### The workspaces are not really arranged in a cuboid fashion. Should we change the name of the extension?

That's a smart point! However, covering only 180°, ensures that no one notices that we cannot rotate the "cube" for an entire round...

## :octocat: I want to contribute!

That's great!
Here are some basic rulles to get you started:
Commits should start with a Capital letter and should be written in present tense (e.g. __:tada: Add cool new feature__ instead of __:tada: Added cool new feature__).
You should also start your commit message with **one** applicable emoji.
This does not only look great but also makes you rethink what to add to a commit. Make many but small commits!

Emoji | Description
------|------------
:tada: `:tada:` | When you added a cool new feature.
:wrench: `:wrench:` | When you added a piece of code.
:recycle: `:recycle:` | When you refactored a part of the code.
:sparkles: `:sparkles:` | When you applied clang-format.
:globe_with_meridians: `:globe_with_meridians:` | When you worked on translations.
:art: `:art:` | When you improved / added assets like themes.
:lipstick: `:lipstick:` | When you worked on the UI of the preferences dialog.
:rocket: `:rocket:` | When you improved performance.
:memo: `:memo:` | When you wrote documentation.
:beetle: `:beetle:` | When you fixed a bug.
:revolving_hearts: `:revolving_hearts:` | When a new sponsor is added or credits are updated.
:heavy_check_mark: `:heavy_check_mark:` | When you worked on checks or adjusted the code to be compliant with them.
:twisted_rightwards_arrows: `:twisted_rightwards_arrows:` | When you merged a branch.
:fire: `:fire:` | When you removed something.
:truck: `:truck:` | When you moved / renamed something.