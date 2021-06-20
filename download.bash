echo downloading...
curl -s https://api.github.com/repos/dada513/prodpush/releases/latest \
  | grep browser_download_url \
  | grep prodpush \
  | cut -d '"' -f 4 \
  | wget -qi -
