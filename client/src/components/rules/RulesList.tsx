import { Check, Edit, Shield } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { RuleSet } from '../../lib/api/types';

interface RulesListProps {
  rules: RuleSet[];
  isLoading: boolean;
  isActivating: boolean;
  activeMutatingName?: string;
  onActivate: (name: string) => void;
  onEdit: (name: string) => void;
  onImportDefaults: () => void;
  isImportingDefaults: boolean;
}

export function RulesList({
  rules,
  isLoading,
  isActivating,
  activeMutatingName,
  onActivate,
  onEdit,
  onImportDefaults,
  isImportingDefaults,
}: RulesListProps) {
  if (isLoading) {
    return <div className="text-center p-8 text-muted col-span-3">Loading rules...</div>;
  }

  if (rules.length === 0) {
    return (
      <div className="col-span-3 flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-lg gap-4 bg-white/5">
        <p className="text-muted">No rule sets found in the database.</p>
        <Button variant="primary" onClick={onImportDefaults} disabled={isImportingDefaults}>
          {isImportingDefaults ? 'Importing...' : 'Import Default Rules'}
        </Button>
      </div>
    );
  }

  return (
    <>
      {rules.map((rule) => (
        <div
          key={rule.rulesHash || rule.name}
          className={clsx(
            'glass-panel p-6 flex flex-col gap-4 relative overflow-hidden transition-all',
            rule.isActive ? 'border-accent-primary shadow-[0_0_30px_rgba(99,102,241,0.15)]' : '',
          )}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {rule.name}
                {rule.isActive && (
                  <Badge variant="success" className="text-[10px] py-0 px-2 h-5">
                    Active
                  </Badge>
                )}
              </h3>
              <span className="text-xs text-muted font-mono">
                {(rule.rulesHash || '').substring(0, 8)}
              </span>
            </div>
            <Shield className={clsx('w-5 h-5', rule.isActive ? 'text-accent-primary' : 'text-muted')} />
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="text-white">{rule.version}</span>
            </div>
            <div className="flex justify-between">
              <span>Created</span>
              <span className="text-white">
                {rule.createdAt ? new Date(rule.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-4 flex gap-2">
            <Button
              variant={rule.isActive ? 'secondary' : 'primary'}
              className="flex-1"
              disabled={rule.isActive || isActivating}
              onClick={() => onActivate(rule.name)}
            >
              {isActivating && activeMutatingName === rule.name
                ? 'Activating...'
                : rule.isActive
                  ? 'Active'
                  : 'Activate'}
              {rule.isActive && <Check size={16} />}
            </Button>
            <Button variant="secondary" onClick={() => onEdit(rule.name)}>
              <Edit size={16} />
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}
