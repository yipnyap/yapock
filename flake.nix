{
  description = "Yipnyap Backend";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
  };

  outputs = {
    self,
    nixpkgs,
    ...
  }: let
    pkgs = nixpkgs.legacyPackages.x86_64-linux;
  in {
    devShell.x86_64-linux = pkgs.mkShell {
      packages = [pkgs.bun pkgs.nodejs-18_x];
    };

    formatter.x86_64-linux = pkgs.alejandra;
  };
}
