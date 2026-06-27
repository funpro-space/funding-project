declare module '*.avif' {
  const content: import('next/image').StaticImageData;
  export default content;
}
