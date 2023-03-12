import RuleSet from './rule-set';

export default class Pkgs {
  ruleSet: RuleSet;
  private list: Record<string, boolean>;

  constructor(ruleSet: RuleSet) {
    this.ruleSet = ruleSet;
    this.list = {};
  }

  toggle(pkgId: string): void {
    if (!this.list[pkgId]) {
      this.list[pkgId] = true;
    } else {
      this.list[pkgId] = !this.list[pkgId];
    }
    
    const stateKeys = Object.keys(this.list);

    stateKeys.forEach((key: string) => {
      if (key !== pkgId && this.ruleSet.hasConflicts(key, pkgId)) {
        this.list[key] = !this.list[key];
      }
    });
  }

  stringSlice(): string {
    let finalList: string[] = [];

    const listIds = Object.keys(this.list).filter(key => this.list[key] === true);

    // Find corresponding dependencies of enabled list ids and append to final list
    listIds.forEach((id: string) => {
      const { allDependencies } = this.ruleSet.loopThroughById(id);

      finalList = [...finalList, ...allDependencies];
    });

    // Stringify and return
    return [...new Set(finalList)].join(',').replace(/,/g, '');
  }
}