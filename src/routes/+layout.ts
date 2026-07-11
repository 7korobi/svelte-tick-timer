// fancy-date の Calendar は FancyDate.lazy() により参照されたサンプルだけを
// 初期化するようになったため、モジュール読み込み時の Cloudflare Workers
// コールドスタート負荷は大きく下がった。それでもこのページは多数の暦を
// 同時表示して継続的に再計算する個人用デモで、SEOも no-JS フォールバックも
// 不要なので、SSRを止めて計算をクライアント(ブラウザ、WorkersのCPU予算と
// 無関係)側に寄せる。
export const ssr = false;
