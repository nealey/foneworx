#! /bin/sh

set -e

cd $(dirname $0)/static
while read url; do
  wget -c $url
done <<EOD
https://www.feisworx.com/favicon.ico
https://www.feisworx.com/images/bg8.jpg
https://www.feisworx.com/images/cards.jpg
https://www.feisworx.com/images/FeisWorxLogo2.gif
https://www.feisworx.com/share/feisworx.css
EOD
