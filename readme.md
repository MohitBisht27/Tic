sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Add user to Docker group

sudo usermod -aG docker ubuntu
newgrp docker

docker ps

## Tic-Tac-Toe

To play the terminal Tic-Tac-Toe game added to this project, run:

```
node tic-tac-toe.js
```

Or via npm:

```
npm run tictactoe
```

Controls: enter a number 1-9 to mark that cell. Choose mode 1 for two-player or mode 2 to play vs a simple CPU.

## Deployment & CI/CD

Developed and deployed a web application using Docker and Amazon Web Services EC2 with an automated CI/CD pipeline.

Integrated the project with GitHub Actions so that every code push automatically builds a Docker image and deploys the updated application to the server.

This project helped in understanding how real-world applications are deployed with automation, reducing manual work and ensuring faster updates.

Tech Stack

- CI/CD: GitHub Actions
- Containerization: Docker
- Cloud: Amazon EC2 (Amazon Web Services)
