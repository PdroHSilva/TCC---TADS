# APPLICATION FOR NEWS OPTIMIZATION AND HIGHLIGHTING CURRENT ENTERTAINMENT.

- [https://docs.google.com/document/d/1eQCwuA5Jpkk0kRdsGTK8FFxlApZFXcadl_LqsF-2H5Q/edit?usp=sharing](https://docs.google.com/document/d/1DYnlFzmnonNVt1q_zbKVKrh6Wtcu1RlepiPM2Jh_ENo/edit?usp=sharing)

# How to Clone a GitHub Repository

## Install Git:

- If you don’t already have Git installed, download and install it from git-scm.com.

## Open Terminal or Windows Powershell:

- On Windows, use Command Prompt or Git Bash.
- On macOS and Linux, you can use Terminal.

## Access GitHub and find the repository:

- Open GitHub in your browser.
- Navigate to the repository you want to clone.

## Copy the repository URL:

- Click on the green **Code** button.
- Select HTTPS or SSH (if you have SSH set up) and copy the URL.

## Navigate to your local directory:

- In your terminal or command prompt, navigate to the directory where you want to clone the repository by using the cd command.

## Run the git clone command:

### In the terminal, type the following command and paste the repository URL:

- git clone https://github.com/peehpimentel/tcc-tads.git

Done! Your repository will be cloned to your local machine. You can now navigate to the repository folder with cd <repository-folder>.

# How to install all dependencies for the application

## First Method: Install Dependencies Individually 

### Install Python 3:

- Download Python from the official website: python.org.
- During installation, ensure you check the box "Add Python to PATH".
- Verify the installation with: python --version

### Verify is Pip is installed:

- Pip usually comes pre-installed with Python. Verify with: pip --version
- If not installed, follow the pip installation guide.

### Activate the virtual environment:

- Virtual environments allow you to isolate Python projects, activate with: 
  - **Windows**:
    ```bash
    .\venv\Scripts\activate
    ```
  - **macOS/Linux**:
    ```bash
    source venv/bin/activate
    ```
### Install Django

- pip install django
- Verify with: python -m django --version

### Install Pillow

- Pillow is required for image processing in Django install with: pip install pillow
- Verify Pillow installation with: python -m PIL

### Run Django Server

- First you need to make migrations of all changes with: python -m manage.py makemigrations
- Apply those migrations: python -m manage.py migrate
- Run server: python -m manage.py runserver
- Open your browser and navigate to http://localhost:8000/ or http://127.0.0.1:8000/

Done! You’ve successfully installed Python, Django, and Pillow, and can now use our application.

## Second Method: Install All Dependencies at once from requirements.txt

### Ensure you’re in your virtual environment:

- **Windows**: .\venv\Scripts\activate
- **macOS/Linux**: source venv/bin/activate

### Install all dependencies:

- Run this command to install all dependencies: pip install -r requirements.txt