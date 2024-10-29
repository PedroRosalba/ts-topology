import * as Y from 'yjs';
import  Delta  from 'quill-delta';

// o objetivo desse arquivo é testar a interoperabilidade do YJS com o quill sem a necessidade do uso do CRO
// precisa verificar oq as funções do QuillBinding fazem: 
    // como elas lidam com deleção ao mesmo tempo -> quero responder isso pq quero saber se o applyDelta vai fazer tudo sozinho ou teremos que codar alguma coisa a mais, tipo colocar timestamp nos deltas e coisa do tipo
