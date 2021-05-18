export async function presentAlert(message: any) {
  const alert = document.createElement("ion-alert");
  alert.message = message;
  alert.buttons = ["OK"];

  document.body.appendChild(alert);
  await alert.present();

  const { role } = await alert.onDidDismiss();
  console.log("onDidDismiss resolved with role", role);
}

export async function presentAlertWithHeader(message: any, header: any) {
  const alert = document.createElement("ion-alert");
  alert.header = header;
  alert.message = message;
  alert.buttons = ["OK"];

  document.body.appendChild(alert);
  await alert.present();

  const { role } = await alert.onDidDismiss();
  console.log("onDidDismiss resolved with role", role);
}
