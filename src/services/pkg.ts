export default class Package {
  id: string;
  dependencies: string[];
  conflicts: string[];
  seen: boolean;

  constructor(id: string) {
    this.id = id;
    this.dependencies = [];
    this.conflicts = [];
    this.seen = false;
  }

  addDep(depId: string) {
    if (!this.dependencies.includes(depId)) {
      this.dependencies.push(depId);
    }
  }

  addConflict(depId: string) {
    if (!this.conflicts.includes(depId)) {
      this.conflicts.push(depId);
    }
  }
}