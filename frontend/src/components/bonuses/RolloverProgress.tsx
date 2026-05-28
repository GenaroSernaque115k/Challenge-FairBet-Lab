interface RolloverProgressProps {
  porcentaje: number
  completado: string
  restante: string
  completo: boolean
}

export default function RolloverProgress({ porcentaje, completado, restante, completo }: RolloverProgressProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px]">
        <span className="text-gray-500">Rollover</span>
        <span className={completo ? 'text-green-400' : 'text-gray-400'}>{porcentaje}%</span>
      </div>
      <div className="h-1.5 bg-black rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            completo ? 'bg-green-500' : 'bg-primary-500'
          }`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px]">
        <span className="text-gray-600">{parseFloat(completado).toFixed(0)} BP</span>
        <span className="text-gray-600">{parseFloat(restante).toFixed(0)} BP restantes</span>
      </div>
    </div>
  )
}
