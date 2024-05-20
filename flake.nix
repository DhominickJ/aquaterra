{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        just sops
      ];
      buildInputs = with pkgs; [ influxdb2 ];
      SOPS_AGE_KEY_FILE = "./local/keys.txt";
    };
    packages.${system}.run-db = {};
  };
}
