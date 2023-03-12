import Pkg from './pkg';

export default class RuleSet {
  private packages: Record<string, Pkg>;

  constructor() {
    this.packages = {};
  }

  private getPackage(id: string): Pkg {
    // Create a new package if it does not exist already
    if (!this.packages[id]) {
      this.packages[id] = new Pkg(id);
    }
    
    return this.packages[id];
  }

  private getResultsRecursively(node: Pkg, result: { dependencies: string[], conflicts: string[] }): void {
    // Loop through all dependencies recursively to extract all dependencies
    if (!node.seen) {
      node.seen = true;

      result.dependencies = [...result.dependencies, ...node.dependencies];
      result.conflicts = [...result.conflicts, ...node.conflicts];

      node.dependencies.forEach((dep) => {
        this.getResultsRecursively(this.packages[dep], result);
      });
    }
  }

  private loopThroughDeps(pkg: Pkg): { allDependencies: string[]; allConflicts: string[] } {
    let result: { dependencies: string[], conflicts: string[] } = { dependencies: [], conflicts: [] };

    Object.keys(this.packages).forEach((p) => this.packages[p].seen = false);

    pkg.dependencies.forEach((d) => {
      this.getResultsRecursively(this.packages[d], result);
    });

    return {
      allDependencies: [...new Set(result.dependencies)],
      allConflicts: [...new Set(result.conflicts)]
    }
  }

  private isConflict(dependencies: string[], conflicts: string[]): boolean {
    return dependencies.some((dep) => conflicts.includes(dep));
  }

  addDep(a: string, b: string): void {
    this.getPackage(a).addDep(b);
    this.getPackage(b).addDep(a);
  }

  addConflict(a: string, b: string): void {
    this.getPackage(a).addConflict(b);
    this.getPackage(b).addConflict(a);
  }

  // Checks to see if the given dependency is included in the conflicts
  hasConflicts(pkgId: string, depIdToCompare: string): boolean {
    const { allConflicts } = this.loopThroughDeps(this.packages[pkgId]);

    return allConflicts.includes(depIdToCompare);
  }

  loopThroughById(id: string): { allDependencies: string[]; allConflicts: string[] } {
    return this.loopThroughDeps(this.packages[id]);
  }

  // Checks to see if the entire rule set is coherent
  isCoherent(): boolean {
    const pkgs = Object.keys(this.packages).map(key => this.packages[key]);

    for (const pkg of pkgs) {
      let { allDependencies, allConflicts } = this.loopThroughById(pkg.id);

      if (this.isConflict(allDependencies, allConflicts)) {
        return false;
      }
    }

    return true;
  }
}