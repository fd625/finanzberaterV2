// utils/formatUtils.js

export const formatUtils = {

  formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  },


  formatDisplayDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  },


  formatLongDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },


  formatContractForDisplay(contract) {
    return {
      ...contract,
      date: this.formatDisplayDate(contract.start_date),
      start_date: contract.start_date,
      end_date: contract.end_date,
      formattedAmount: this.formatCurrency(contract.amount)
    };
  },


  parseCurrencyInput(value) {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
};