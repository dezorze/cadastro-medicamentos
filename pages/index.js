import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase (substitua com suas credenciais)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
const testando = 'é um teste no github. vou apagar!'
export default function CadastroMedicamentos() {
  const [medicamentos, setMedicamentos] = useState([])
  const [nome, setNome] = useState('')
  const [lote, setLote] = useState('')
  const [val, setVal] = useState('')
  const [qtde, setQtde] = useState('')

  // Buscar medicamentos
  const fetchMedicamentos = async () => {
    const { data, error } = await supabase
      .from('medicamentos')
      .select('*')
      .order('id', { ascending: false })
    
    if (!error) setMedicamentos(data)
  }

  // Carregar medicamentos ao iniciar
  useEffect(() => {
    fetchMedicamentos()
  }, [])

  // Adicionar novo medicamento
  const addMedicamento = async (e) => {
    e.preventDefault()
    
    const { error } = await supabase
      .from('medicamentos')
      .insert([{ nome, lote, val, qtde: parseInt(qtde) }])
    
    if (!error) {
      // Limpar formulário e recarregar lista
      setNome('')
      setLote('')
      setVal('')
      setQtde('')
      fetchMedicamentos()
    }
  }

  // Deletar medicamento
  const deleteMedicamento = async (id) => {
    const { error } = await supabase
      .from('medicamentos')
      .delete()
      .eq('id', id)
    
    if (!error) fetchMedicamentos()
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Cadastro de Medicamentos</h1>
      
      {/* Formulário de cadastro */}
      <form onSubmit={addMedicamento} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc' }}>
        <h2>Novo Medicamento</h2>
        <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
          <input
            type="text"
            placeholder="Nome do medicamento"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ padding: '8px' }}
          />
          <input
            type="text"
            placeholder="Número do lote"
            value={lote}
            onChange={(e) => setLote(e.target.value)}
            required
            style={{ padding: '8px' }}
          />
          <input
            type="date"
            placeholder="Validade"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            required
            style={{ padding: '8px' }}
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={qtde}
            onChange={(e) => setQtde(e.target.value)}
            required
            style={{ padding: '8px' }}
          />
        </div>
        <button 
          type="submit"
          style={{ marginTop: '10px', padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none' }}
        >
          Adicionar Medicamento
        </button>
      </form>

      {/* Lista de medicamentos */}
      <div>
        <h2>Medicamentos Cadastrados</h2>
        {medicamentos.length === 0 ? (
          <p>Nenhum medicamento cadastrado.</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {medicamentos.map((med) => (
              <div key={med.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '5px' }}>
                <h3>{med.nome}</h3>
                <p>Lote: {med.lote}</p>
                <p>Validade: {new Date(med.val).toLocaleDateString('pt-BR')}</p>
                <p>Quantidade: {med.qtde}</p>
                <button 
                  onClick={() => deleteMedicamento(med.id)}
                  style={{ padding: '5px 10px', background: '#ff4444', color: 'white', border: 'none' }}
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}