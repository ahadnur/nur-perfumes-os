export const formatTransactionDate = (isoString) => {
    if (!isoString) return 'Never';
    
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };