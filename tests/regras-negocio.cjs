// Executar com: node tests/regras-negocio.cjs (após npm install).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText, filename);
};
const { situacaoDocumento, tarefaAtrasada } = require('../src/lib/dashboard/situacao.ts');
const { somarDias } = require('../src/lib/dashboard/datas.ts');
const hoje = '2026-11-24';
for (const [dias, esperado] of [[-1,'Vencido'],[0,'A vencer'],[1,'A vencer'],[15,'A vencer'],[16,'Vigente'],[30,'Vigente']]) {
  assert.equal(situacaoDocumento(somarDias(hoje,dias),hoje), esperado);
}
assert.equal(situacaoDocumento(null,hoje),'Vigente');
assert.equal(tarefaAtrasada('Pendente','2026-11-23',hoje),true);
assert.equal(tarefaAtrasada('Concluída','2026-11-23',hoje),false);
console.log('9 verificações de datas e status passaram.');
