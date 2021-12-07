//////////////////////////////////////////////////////////////////////////////////////////
// ,-.  ,--.  ,-.  ,  , ,---.  ,-.  ;-.     ,-. .  . ,-.  ,--.       Copyright (c) 2021 //
// |  \ |    (   ` | /    |   /   \ |  )   /    |  | |  ) |            Simon Schneegans //
// |  | |-    `-.  |<     |   |   | |-'    |    |  | |-<  |-   Released under the GPLv3 //
// |  / |    .   ) | \    |   \   / |      \    |  | |  ) |       or later. See LICENSE //
// `-'  `--'  `-'  '  `   '    `-'  '       `-' `--` `-'  `--'        file for details. //
//////////////////////////////////////////////////////////////////////////////////////////

'use strict';

const Main             = imports.ui.main;
const OverviewControls = imports.ui.overviewControls;
const WorkspacesView   = imports.ui.workspacesView.WorkspacesView;
const FitMode          = imports.ui.workspacesView.FitMode;
const Util             = imports.misc.util;

const ExtensionUtils = imports.misc.extensionUtils;
const Me             = imports.misc.extensionUtils.getCurrentExtension();
const utils          = Me.imports.utils;

//////////////////////////////////////////////////////////////////////////////////////////
// This extensions modifies three methods of the WorkspacesView class of GNOME Shell.   //
// By doing this, it tweaks the positioning of workspaces in overview mode to make the  //
// look like cube faces.                                                                //
//////////////////////////////////////////////////////////////////////////////////////////

const WORKSPACE_SEPARATION     = 180;  // Complete angle covered by our "cube".
const TWO_WORKSPACE_SEPARATION = 90;   // Angle covered  if there are only tow workspaces.
const ACTIVE_OPACITY           = 255;  // Opacity of the front face of the "cube".
const INACTIVE_OPACITY         = 200;  // Opacity of all other faces.
const DEPTH_SEPARATION         = 50;   // Distance between window previews and cube faces.

class Extension {
  // The constructor is called once when the extension is loaded, not enabled.
  constructor() {
    this._origUpdateWorkspacesState = null;
    this._origGetSpacing            = null;
    this._origUpdateVisibility      = null;
    this._lastWorkspaceWidth        = 0;
  }

  // ----------------------------------------------------------------------.- public stuff

  // This function could be called after the extension is enabled, which could be done
  // from GNOME Tweaks, when you log in or when the screen is unlocked.
  enable() {

    // We will monkey-patch these three methods. Let's store the original ones.
    this._origUpdateWorkspacesState = WorkspacesView.prototype._updateWorkspacesState;
    this._origGetSpacing            = WorkspacesView.prototype._getSpacing;
    this._origUpdateVisibility      = WorkspacesView.prototype._updateVisibility;

    // We will use extensionThis to refer to the extension inside the patched methods of
    // the WorkspacesView.
    const extensionThis = this;

    // Normally, all workspaces outside the current field-of-view are hidden. We want to
    // show all workspaces, so we patch this method. The original code is about here:
    // https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/workspacesView.js#L436
    WorkspacesView.prototype._updateVisibility = function() {
      this._workspaces.forEach((w) => {
        w.show();
      });
    };

    // Usually, workspaces are placed next to each other separated by a few pixels (this
    // separation is usually computed by the method below). To create the desktop cube, we
    // have to position all workspaces on top of each other and rotate the around a pivot
    // point in the center of the cube.
    // The original arrangement of the workspaces is implemented in WorkspacesView's
    // vfunc_allocate() which cannot be monkey-patched. As a workaround, we return a
    // negative spacing in the method below...
    // The original code is about here:
    // https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/workspacesView.js#L219
    WorkspacesView.prototype._getSpacing = function(box, fitMode, vertical) {
      // We use the "normal" workspace spacing in desktop and app-grid mode.
      const origValue =
          extensionThis._origGetSpacing.apply(this, [box, fitMode, vertical]);

      if (fitMode == FitMode.ALL) {
        return origValue;
      }

      // Compute the negative spacing required to arrange workspaces on top of each other.
      const overlapValue = -this._workspaces[0].get_preferred_width(box.get_size()[1])[1];

      // Compute blending state from and to the overview.
      const overviewMode = extensionThis._getOverviewMode(this);

      // Blend between the negative overlap-spacing and the "normal" spacing value.
      return (1 - overviewMode) * origValue + overviewMode * overlapValue;
    };

    // This is the main method which is called whenever the workspaces need to be
    // repositioned.
    // https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/workspacesView.js#L255
    WorkspacesView.prototype._updateWorkspacesState = function() {
      // Use the original method if we have just one workspace.
      const faceCount = this._workspaces.length;
      if (faceCount <= 1) {
        extensionThis._origUpdateWorkspacesState.apply(this);
        return;
      }

      // First we need the width of a single workspace. Simply calling
      // this._workspaces[0]._background.width does not work in all cases, as this method
      // seems to be called also when the background actor is not on the stage. As a hacky
      // workaround, we store the last valid workspace width we got and use that value if
      // we cannot get a new one...
      let workspaceWidth = extensionThis._lastWorkspaceWidth;
      if (this._workspaces[0]._background.get_stage() &&
          this._workspaces[0]._background.allocation.get_width()) {
        workspaceWidth = extensionThis._lastWorkspaceWidth =
            this._workspaces[0]._background.allocation.get_width();
      }

      // Our "cube" only covers 180°, if there are only two workspaces, it covers 90°.
      const maxAngle = (faceCount == 2 ? TWO_WORKSPACE_SEPARATION : WORKSPACE_SEPARATION);

      // That's the angle between consecutove workspaces.
      const faceAngle = maxAngle / (faceCount - 1);

      // That's the z-distance from the cube faces to the rotation pivot.
      const centerDepth = workspaceWidth / 2 / Math.atan(faceAngle * 0.5 * Math.PI / 180);

      // Compute blending state from and to the overview and from and to the app grid
      // mode. We will use overviewMode to fold and unfold the cube, and appGridMode to
      // attenuate the scaling effect of the active workspace.
      const overviewMode = extensionThis._getOverviewMode(this);
      const appGridMode  = this._fitModeAdjustment.value;

      // Now loop through all workspace and compute the individual rotations.
      this._workspaces.forEach((w, index) => {
        // This updates the corner radii.
        w.stateAdjustment.value = overviewMode;

        // Update rotation.
        w.pivot_point_z = overviewMode * -centerDepth;
        w.rotation_angle_y =
            overviewMode * (-this._scrollAdjustment.value + index) * faceAngle;

        // Add some separation between background and windows.
        w._background.translation_z = overviewMode * -DEPTH_SEPARATION;

        // Distance to being the active workspace in [1..0].
        const dist = 1 - Math.clamp(Math.abs(this._scrollAdjustment.value - index), 0, 1);

        // Update opacity only in overview mode.
        let opacity = Util.lerp(INACTIVE_OPACITY, ACTIVE_OPACITY, dist);
        opacity     = 255 * (1 - overviewMode) + opacity * overviewMode;
        w._background.set_opacity(opacity);

        // Update scale only in app grid mode.
        let scale =
            Util.lerp(imports.ui.workspacesView.WORKSPACE_INACTIVE_SCALE, 1, dist);
        scale = (1 - appGridMode) + scale * appGridMode;
        w.set_scale(scale, scale);
      });

      // The remainder of this method cares about proper depth sorting. First, we sort the
      // workspaces so that they are drawn back-to-front. Thereafter, we ensure that for
      // front-facing workspaces the background is drawn behind the window previews. For
      // back-facing workspaces this order is swapped.

      // The depth-sorting of cube faces is quite simple, we create a copy of the
      // workspaces list and sort it by increasing rotation angle.
      const workspaces = this._workspaces.slice();
      workspaces.sort((a, b) => {
        return Math.abs(a.rotation_angle_y) - Math.abs(b.rotation_angle_y);
      });

      // Then sort the children actors accordingly.
      for (let i = 1; i < workspaces.length; i++) {
        const w = workspaces[i];
        w.get_parent().set_child_below_sibling(w, workspaces[i - 1]);
      }

      // Now we compute wether the individual cube faces are front-facing or back-facing.
      // This is surprisingly difficult ... can this be simplified? Here, we compute the
      // angle between the vectors (camera -> cube face) and (rotation center -> cube
      // face). If this is > 90° it's front-facing.

      // First, compute distance of virtual camera to the front workspaces plane.
      const camDist = Main.layoutManager.monitors[this._monitorIndex].height /
          (2 * Math.tan(global.stage.perspective.fovy / 2 * Math.PI / 180));

      // Then loop through all workspaces.
      for (let i = 0; i < this._workspaces.length; i++) {
        const w = this._workspaces[i];

        if (w.rotation_angle_y == 0) {

          // Special case: The workspace is directly in front of us.
          w.set_child_below_sibling(w._background, null);

        } else {

          // Length of vector from camera to rotation center.
          const a = camDist + centerDepth;

          // Length of vector from cube face to rotation center.
          const b = centerDepth;

          // Enclosed angle between the a and b.
          const gamma = Math.abs(w.rotation_angle_y);

          // Length of vector from virtual camera to center of the cube face. Computed
          // with law of cosines: c²=a²+b²-2ab*cos(gamma).
          const c =
              Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(gamma * Math.PI / 180));

          // Enclosed angle between vector from virtual camera to center of the cube face
          // and from center of cube face to rotation center. Computed Law of cosines:
          // alpha=acos((b²+c²-a²)(2bc))
          const alpha = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180 / Math.PI;

          // Draw the background actor first if it's a front-facing cube side. Draw it
          // last if it's a back-facing cube side.
          if (alpha > 90) {
            w.set_child_below_sibling(w._background, null);
          } else {
            w.set_child_above_sibling(w._background, null);
          }
        }
      }
    };
  }

  // This function could be called after the extension is uninstalled, disabled in GNOME
  // Tweaks, when you log out or when the screen locks.
  disable() {

    // Restore the original behavior.
    WorkspacesView.prototype._updateWorkspacesState = this._origUpdateWorkspacesState;
    WorkspacesView.prototype._getSpacing            = this._origGetSpacing;
    WorkspacesView.prototype._updateVisibility      = this._origUpdateVisibility;
  }

  // ----------------------------------------------------------------------- private stuff

  // This method returns 1 if we are in overview state and 0 in app grid state and the
  // desktop state. In between, the value is smoothly interpolated.
  _getOverviewMode(workspacesView) {
    const {initialState, finalState, progress} =
        workspacesView._overviewAdjustment.getStateTransitionParams();

    return Util.lerp(
        workspacesView._getWorkspaceModeForOverviewState(initialState),
        workspacesView._getWorkspaceModeForOverviewState(finalState), progress);
  }
}

// This function is called once when the extension is loaded, not enabled.
function init() {
  return new Extension();
}
