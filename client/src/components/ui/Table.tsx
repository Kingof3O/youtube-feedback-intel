interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  isLoading,
  emptyMessage = 'No data available',
  onRowClick,
}: TableProps<T>) {
  const getCellValue = (item: T, key: string): React.ReactNode => {
    const value = (item as Record<string, unknown>)[key];
    return typeof value === 'string' || typeof value === 'number'
      ? value
      : String(value ?? '');
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center text-muted">
        <span className="spinner" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full p-8 text-center text-muted border border-dashed border-white/10 rounded-lg">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-sm text-muted">
            {columns.map((col) => (
              <th
                key={col.key}
                className="p-3 font-medium cursor-default select-none whitespace-nowrap"
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="p-3 align-middle">
                  {col.render ? col.render(item) : getCellValue(item, col.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
