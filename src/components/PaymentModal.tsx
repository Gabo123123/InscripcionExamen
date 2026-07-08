interface PaymentItem {
  tipo: string
  operacion: string
  monto: string
  fecha: string
}

interface PaymentModalProps {
  visible: boolean
  onClose: () => void
  newPayment: PaymentItem
  setNewPayment: (payment: PaymentItem) => void
  payments: PaymentItem[]
  addPayment: () => void
  paymentTotal: number
  onValidatePayment: () => void
  onRemovePayment: (index: number) => void
}

export default function PaymentModal({
  visible,
  onClose,
  newPayment,
  setNewPayment,
  payments,
  addPayment,
  paymentTotal,
  onValidatePayment,
  onRemovePayment,
}: PaymentModalProps) {
  if (!visible) return null

  const pagoOptions = ['Entidad Financiera (Banco/Caja)', 'Depósito en efectivo', 'Transferencia']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6">
      <div className="max-w-3xl rounded-3xl bg-white p-6 shadow-2xl shadow-slate-900/30">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Datos del pago</p>
            <h3 className="text-xl font-semibold text-slate-900">Monto base: S/. 400.00</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Pago por
            <select
              value={newPayment.tipo}
              onChange={(event) => setNewPayment({ ...newPayment, tipo: event.target.value })}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            >
              {pagoOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Nro. Operación
            <input
              value={newPayment.operacion}
              onChange={(event) => setNewPayment({ ...newPayment, operacion: event.target.value })}
              placeholder="Nro. Operación"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Monto
            <input
              value={newPayment.monto}
              onChange={(event) => setNewPayment({ ...newPayment, monto: event.target.value })}
              placeholder="Monto"
              type="number"
              min={0}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Fecha
            <input
              type="date"
              value={newPayment.fecha}
              onChange={(event) => setNewPayment({ ...newPayment, fecha: event.target.value })}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={addPayment}
            className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-400/20 transition hover:bg-orange-600"
          >
            Agregar
          </button>
          <div className="text-sm text-slate-500">Mostrar {payments.length} registro(s)</div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr_0.8fr] gap-2 bg-slate-100 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-500">
            <span>Tipo</span>
            <span>Nro. Operación</span>
            <span>Monto</span>
            <span>Fecha</span>
            <span>Opciones</span>
          </div>
          {payments.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">Ningún dato disponible en esta tabla</div>
          ) : (
            payments.map((item, index) => (
              <div key={`${item.operacion}-${index}`} className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr_0.8fr] gap-2 border-t border-slate-200 px-4 py-4 text-sm text-slate-700">
                <span>{item.tipo}</span>
                <span>{item.operacion}</span>
                <span>S/. {item.monto}</span>
                <span>{item.fecha}</span>
                <button
                  type="button"
                  onClick={() => onRemovePayment(index)}
                  className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 flex items-center justify-between rounded-3xl bg-slate-100 px-5 py-4 text-sm text-slate-700">
          <span>Total ingresado</span>
          <span className="font-semibold">S/. {paymentTotal.toFixed(2)}</span>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => {
              onValidatePayment()
              onClose()
            }}
            className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
