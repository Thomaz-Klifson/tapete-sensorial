/* eslint-disable prettier/prettier */
import { ElectronAPI } from '@electron-toolkit/preload';

/**
 * Declaração do objeto global `window` com as interfaces `electron` e `api`.
 *
 * Esta declaração permite que o TypeScript reconheça as propriedades `electron` e `api`
 * no objeto `window`, facilitando o acesso às APIs do Electron e qualquer outra API personalizada.
 *
 * - **ElectronAPI**: Interface que define a API do Electron disponível no contexto de preload.
 * - **api**: Propriedade de tipo desconhecido (unknown), que pode ser usada para estender
 *           funcionalidades adicionais conforme necessário.
 *
 * @interface Window
 * @global
 */
declare global {
  interface Window {
    electron: ElectronAPI;
    api: unknown;
  }
}
