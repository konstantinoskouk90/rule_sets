import { expect } from 'chai';
import RuleSet from '../src/services/rule-set';
import Pkgs from '../src/services/pkgs';

describe('rule sets', () => {  
  it('aa', () => {
    const ruleSet = new RuleSet();
    ruleSet.addDep('a', 'a');

    expect(ruleSet.isCoherent()).to.equal(true);
  });

  it('exclusive ab, ba', () => {
    const ruleSet = new RuleSet();
    ruleSet.addDep('a', 'b');
    ruleSet.addDep('b', 'a');

    expect(ruleSet.isCoherent()).to.equal(true);
  });

  it('exclusive ab', () => {
    const ruleSet = new RuleSet();
    ruleSet.addDep('a', 'b');
    ruleSet.addConflict('a', 'b');

    expect(ruleSet.isCoherent()).to.equal(false);
  });

  it('exclusive ab, bc', () => {
    const ruleSet = new RuleSet();
    ruleSet.addDep('a', 'b');
    ruleSet.addDep('b', 'c');
    ruleSet.addConflict('a', 'c');

    expect(ruleSet.isCoherent()).to.equal(false);
  });

  it.only('deep deps', () => {
    const ruleSet = new RuleSet();
    ruleSet.addDep('a', 'b');
    ruleSet.addDep('b', 'c');
    ruleSet.addDep('c', 'a');
    ruleSet.addDep('d', 'e');
    ruleSet.addConflict('c', 'e');
    expect(ruleSet.isCoherent()).to.equal(true);

    const opts = new Pkgs(ruleSet);

    opts.toggle('a');
    expect(opts.stringSlice()).to.equal('acb');

    ruleSet.addDep('f', 'f');
    opts.toggle('f');
    expect(opts.stringSlice()).to.equal('acbf');

    opts.toggle('e');
    expect(opts.stringSlice()).to.equal('ef');

    opts.toggle('b');
    expect(opts.stringSlice()).to.equal('acbf');

    ruleSet.addDep('b', 'g');
    opts.toggle('g');
    opts.toggle('b');
    expect(opts.stringSlice()).to.equal('gf');
  });

  it('ab, bc toggle', () => {
    const ruleSet = new RuleSet();
    ruleSet.addDep('a', 'b');
    ruleSet.addDep('b', 'c');

    const opts = new Pkgs(ruleSet);
    opts.toggle('c');
    expect(opts.stringSlice()).to.equal('c');
  });

  it('ab, ac', () => {
    const ruleSet = new RuleSet();
    ruleSet.addDep('a', 'b');
    ruleSet.addDep('a', 'c');
    ruleSet.addConflict('b', 'd');
    ruleSet.addConflict('b', 'e');
    expect(ruleSet.isCoherent()).to.equal(true);

    const opts = new Pkgs(ruleSet);
    opts.toggle('d');
    opts.toggle('e');
    opts.toggle('a');
    expect(opts.stringSlice()).to.equal('abc');
  });
});