sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Add user to Docker group
sudo usermod -aG docker ubuntu
newgrp docker

docker ps