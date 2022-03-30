let
  holonixPath = builtins.fetchTarball "https://github.com/holochain/holonix/archive/6d2d051256c53778e07c82215c9aefc2656a2bdc.tar.gz";
  holonix = import (holonixPath) {
    holochainVersionId = "v0_0_126";
  };
  nixpkgs = holonix.pkgs;
in nixpkgs.mkShell {
  inputsFrom = [ holonix.main ];
  packages = with nixpkgs; [
    # Additional packages go here
    nodejs-16_x
  ];
}
