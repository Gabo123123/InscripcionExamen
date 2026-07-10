import { QRCodeSVG } from 'qrcode.react'
import Barcode from 'react-barcode'
import logoUnica from '../assets/logo-unica.png'
import type { FormData } from '../App'
import './CarnetPDF.css'

interface Props {
  form: FormData
}

export default function CarnetPDF({ form }: Props) {
  const qrTexto = `POSTULANTE:${form.nroDocumento}-${form.apellidoPaterno}-${form.apellidoMaterno}-${form.nombres}`
  const barcodeValue = form.nroDocumento || '00000000'

  const Tarjeta = ({ lado }: { lado: string }) => (
    <div className="carnet-tarjeta">
      <div className="carnet-encabezado">
        <div className="carnet-logo-uni">
          <img src={logoUnica} alt="Logo UNICA" className="h-auto object-contain" style={{ width: '90px' }} />
        </div>
        <div className="carnet-titulo-direccion">DIRECCIÓN DE ADMISIÓN</div>
      </div>

      <div className="carnet-subtitulo">CARNÉ DE POSTULANTE - DECLARACIÓN JURADA DE VERACIDAD DE INFORMACIÓN</div>

      <div className="carnet-cuerpo">
        <div className="carnet-datos">
          <div className="fila"><span className="carnet-etiqueta">CÓDIGO DEL POSTULANTE:</span> <span className="carnet-valor">{form.nroDocumento}</span></div>
          <div className="fila"><span className="carnet-etiqueta">APELLIDO PATERNO:</span> <span className="carnet-valor">{form.apellidoPaterno?.toUpperCase()}</span></div>
          <div className="fila"><span className="carnet-etiqueta">APELLIDO MATERNO:</span> <span className="carnet-valor">{form.apellidoMaterno?.toUpperCase()}</span></div>
          <div className="fila"><span className="carnet-etiqueta">NOMBRES:</span> <span className="carnet-valor">{form.nombres?.toUpperCase()}</span></div>
          <div className="fila"><span className="carnet-etiqueta">MODALIDAD:</span> <span className="carnet-valor">{form.modalidad}</span></div>
          <div className="fila"><span className="carnet-etiqueta">CARRERA PROFESIONAL:</span> <span className="carnet-valor">{form.escuelaProfesional}</span></div>
          <div className="fila"><span className="carnet-etiqueta">FECHA DE EXAMEN:</span> <span className="carnet-valor"></span></div>
        </div>

        <div className="carnet-foto-bloque">
          {form.foto ? (
            <img className="carnet-foto" src={form.foto} alt="Foto" />
          ) : (
            <svg className="carnet-foto" style={{ backgroundColor: '#e2e8f0' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150">
              <rect width="120" height="150" fill="#e5e7eb"/>
              <circle cx="60" cy="55" r="28" fill="#9ca3af"/>
              <path d="M15 150 C15 105 105 105 105 150 Z" fill="#9ca3af"/>
            </svg>
          )}
          <div className="carnet-lados-container">
            <div className="carnet-lado-vertical-vacio"></div>
            <div className="carnet-lado-vertical-outer">
              <div className="carnet-lado-vertical-inner">{lado}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="carnet-seccion">
        <div className="carnet-seccion-titulo">DECLARACIÓN JURADA</div>
        <ul>
          <li>La información consignada al momento de inscribirme es verdadera y de mi entera responsabilidad.</li>
          <li>Conozco y acepto todas las disposiciones del Reglamento de Admisión, al cual me someto.</li>
          <li>En caso de alcanzar una vacante, me comprometo a cumplir con lo dispuesto en el Reglamento de Admisión.</li>
        </ul>
      </div>

      <div className="carnet-seccion">
        <div className="carnet-seccion-titulo">DÍA DEL EXAMEN</div>
        <ul>
          <li>Presentarse con este carné en el local que le corresponda rendir su Examen de Admisión.</li>
          <li>Portar el DNI original. Los extranjeros presentarán su pasaporte o carné de extranjería.</li>
          <li>La firma e impresión dactilar se realizará en el aula asignada.</li>
          <li>Deberá traer lápiz, borrador y tajador.</li>
        </ul>
      </div>

      <div className="carnet-fila-inferior">
        <div className="carnet-col-izquierda">
          <QRCodeSVG value={qrTexto} size={75} level="M" includeMargin={false} />
          <div className="mt-1" style={{ width: 110, overflow: 'hidden' }}>
            <Barcode value={barcodeValue} width={1} height={26} displayValue={false} margin={0} />
          </div>
          <div className="carnet-no-tocar">No tocar esta área</div>
        </div>

        <div className="carnet-col-firmas">
          <div className="carnet-linea-firma">FIRMA DEL POSTULANTE</div>
          <div className="carnet-linea-firma">FIRMA DEL DOCENTE</div>
        </div>

        <div className="carnet-col-huellas">
          <div className="carnet-caja-huella">
            {/* Vacío */}
          </div>
          <div className="carnet-caja-huella">
            <span className="carnet-txt-huella">Huella Día<br/>del Examen</span>
          </div>
          <div className="carnet-caja-huella">
            <span className="carnet-txt-huella">Huella Al Recoger<br/>Certificado de Ingreso</span>
          </div>
        </div>
      </div>

      <div className="carnet-fila-final">
        <div className="carnet-grupo-final">
          <div className="carnet-cajas-final">
            <div className="carnet-celda"></div><div className="carnet-celda"></div><div className="carnet-celda"></div><div className="carnet-celda"></div>
          </div>
          <div className="carnet-etiqueta-final">FACULTAD</div>
        </div>
        <div className="carnet-grupo-final">
          <div className="carnet-cajas-final">
            <div className="carnet-celda"></div><div className="carnet-celda"></div><div className="carnet-celda"></div><div className="carnet-celda"></div>
          </div>
          <div className="carnet-etiqueta-final">AULA</div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HOJA 1: Carné de Postulante */}
      <div id="carnet-page-1" className="carnet-pdf-container">
        <div className="carnet-pagina">
          <Tarjeta lado="PARA LA UNIVERSIDAD" />
          <Tarjeta lado="PARA EL POSTULANTE" />
        </div>
      </div>

      {/* HOJA 2: Declaración Jurada de Antecedentes (VERTICAL) */}
      <div id="carnet-page-2" className="carnet-pdf-portrait">
        <div className="declaracion-header flex items-start gap-4 mb-14">
          <img src={logoUnica} alt="Logo UNICA" className="object-contain" style={{ width: '110px' }} />
          <div className="flex-1 text-center font-bold leading-relaxed pt-3 pr-12" style={{ color: '#1f2937' }}>
            <p className="text-base">OFICINA CENTRAL DE ADMISIÓN</p>
            <p className="text-[13px] uppercase mt-2">PROCESO DE ADMISIÓN PROCESO DE INSCRIPCIÓN</p>
            <p className="text-lg mt-3">DECLARACIÓN JURADA DE NO TENER<br/>ANTEcedentes PENALES</p>
          </div>
        </div>

        <div className="declaracion-datos text-sm space-y-3 mb-16 max-w-xl" style={{ color: '#1e293b' }}>
          <p className="mb-4">Por la presente, el suscrito:</p>
          <div className="flex text-[13px] leading-relaxed mb-1 mt-1">
            <div className="w-[130px]">Apellidos</div><div className="w-[20px]">:</div><div className="font-semibold uppercase">{form.apellidoPaterno} {form.apellidoMaterno}</div>
          </div>
          <div className="flex text-[13px] leading-relaxed mb-1">
            <div className="w-[130px]">Nombres(s)</div><div className="w-[20px]">:</div><div className="font-semibold uppercase">{form.nombres}</div>
          </div>
          <div className="flex text-[13px] leading-relaxed mb-1">
            <div className="w-[130px]">DNI</div><div className="w-[20px]">:</div><div className="font-semibold uppercase">{form.nroDocumento}</div>
          </div>
          <div className="flex text-[13px] leading-relaxed mb-1 items-center">
            <div className="w-[130px] leading-tight">Fecha de<br/>Nacimiento</div><div className="w-[20px]">:</div><div className="font-semibold uppercase">{form.fechaNacimiento?.split('-').reverse().join('/')}</div>
          </div>
          <div className="flex text-[13px] leading-relaxed mb-1 mt-1">
            <div className="w-[130px]">Modalidad</div><div className="w-[20px]">:</div><div className="font-semibold uppercase">{form.modalidad}</div>
          </div>
        </div>

        <div className="declaracion-cuerpo text-sm text-justify leading-relaxed mb-8" style={{ color: '#1e293b' }}>
          DECLARO BAJO JURAMENTO QUE NO REGISTRO ANTECEDENTES PENALES NI JUDICIALES Esta declaración se formula en aplicación del principio de veracidad establecido en el artículo 49 del Texto Único Ordenado de la Ley N° 27444, Ley del Procedimiento Administrativo General, aprobado por Decreto Supremo N° 004-2019-JUS y sus normas modificatorias; y asumo, de corresponder, la responsabilidad administrativa, civil y/o penal cuando por cualquier acción de verificación se compruebe la falsedad o inexactitud de la presente declaración jurada.
        </div>

        <div className="declaracion-footer text-sm mb-20" style={{ color: '#1e293b' }}>
          En señal de conformidad, firmo a continuación.
        </div>

        <div className="flex justify-end text-sm mb-8 pr-12" style={{ color: '#1e293b' }}>
          Ica, {new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </div>

        <div className="declaracion-firmas flex items-end justify-between px-16 mt-32">
          <div className="text-center w-80">
            <div className="pt-2 text-[13px]" style={{ borderTop: '1px solid black' }}>
              Firma del Postulante
            </div>
            <div className="mt-2 text-[13px]">
              DNI N° {form.nroDocumento}
            </div>
          </div>
          <div className="w-24 h-32 mr-24" style={{ border: '1px solid #9ca3af', backgroundColor: 'transparent' }}>
          </div>
        </div>
      </div>
    </div>
  )
}
