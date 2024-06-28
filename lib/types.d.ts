declare module '*?sw' {
  const exp: (opts: RegistrationOptions) => Promise<ServiceWorkerRegistration>
  export default exp
}
