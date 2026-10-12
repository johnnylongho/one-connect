import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  containerClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, containerClassName, children, ...props }, ref) => {
    return (
      <div className={cn('relative inline-block w-full', containerClassName)}>
        <select
          ref={ref}
          className={cn(
            'w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs transition-all focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer h-11',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
