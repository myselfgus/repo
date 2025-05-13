// Arquivo de teste para HEALTH/HEALTH GenAI Script
import genaiScript from './genaisrc/.genai.mts';

async function runTest() {
  try {
    const query = '$fundamentos: Como o modelo HEALTH/HEALTH se diferencia dos sistemas de diagnóstico tradicionais?';
    console.log('Executando consulta:', query);
    
    const result = await genaiScript(query);
    console.log('Resultado:');
    console.log(result);
  } catch (error) {
    console.error('Erro ao executar script:', error);
  }
}

runTest();
