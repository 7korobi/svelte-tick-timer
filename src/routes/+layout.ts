// fancy-date の Calendar は約20種の暦をモジュール読み込み時に構築するため、
// SSR経路(サーバー側でこのモジュールを評価する)だとCloudflare Workersの
// コールドスタートでCPU時間を大きく消費する(実測cpuTime約2秒、無料枠の
// 10msを大幅に超過)。このアプリはSEOも no-JS フォールバックも不要な
// 個人用デモなので、SSRを止めて計算をクライアント(ブラウザ、Workersの
// CPU予算と無関係)側に寄せる。
export const ssr = false;
