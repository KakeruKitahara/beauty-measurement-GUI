FROM ubuntu

WORKDIR /root/work

RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  python3 \
  python3-pip \
  curl && \
  curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
  apt-get install -y nodejs && \
  apt-get autoremove -y && apt-get clean && \
  rm -rf /usr/local/src/* && \
  npm install -g yarn

RUN update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 30 && \
  update-alternatives --install /usr/bin/python python /usr/bin/python3 30