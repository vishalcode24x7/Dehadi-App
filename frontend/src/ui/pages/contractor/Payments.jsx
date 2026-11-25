import { usePayments } from '../../../hooks/usePayments'
import MoneyEntryPage from '../../components/MoneyEntryPage'

function Payments() {
  const payments = usePayments()

  return (
    <MoneyEntryPage
      namespace="payments"
      workers={payments.workers}
      items={payments.items}
      loading={payments.loading}
      error={payments.error}
      toast={payments.toast}
      clearToast={payments.clearToast}
      loadEntries={payments.loadPayments}
      createEntry={payments.createPayment}
      deleteEntry={payments.deletePayment}
    />
  )
}

export default Payments
