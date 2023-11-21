export const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noreferrer");
};

export const openMail = (mail: string, subject: string, body: string) => {
  window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`;
};
