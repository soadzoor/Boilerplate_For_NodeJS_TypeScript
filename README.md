# Installing/building dependencies
You'll need to have openssl, and some other packages installed on your system. On debian/ubuntu, try the following:
sudo apt install pkg-config libssl-dev

## db
sudo apt install postgresql

change postgres password to the password you find in the config file (or vica versa!), they have to match:
ALTER USER user_name WITH PASSWORD 'new_password';

To manipulate the database in a shell:
Switch to postgres user with this command: sudo -i -u postgres
then type "psql" to go into sql mode.

When finished, exit from sql mode with \q
And return to your main user with "exit"

## ssl for https:
letsencrypt.com, and follow the steps on certbot. You need to have a working domain, that redirects to your servers IP address already.
https://certbot.eff.org



## Node.js
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -

The command will add the NodeSource signing key to your system, create an apt sources repository file, install all necessary packages and refresh the apt cache.

If you need to install another version, for example 12.x, just change setup_14.x with setup_12.x

sudo apt install nodejs

you also need the global node-pre-gyp for some binary packages, like argon2:
npm install -g node-pre-gyp

## Keep my service running even when I quit putty (or other CLI)
sudo apt install screen

(hit enter when prompted)

run the service you want, just like you would normally

Hit Ctrl + A, then Ctrl + D. You will see the message "detached".

More info: https://www.digitalocean.com/community/questions/how-keep-my-app-running-after-close-putty-f82aab17-ca84-46a0-8a39-3e25f1dd2d45

And also: https://www.howtogeek.com/howto/ubuntu/keep-your-ssh-session-running-when-you-disconnect/



# Email setup
Setting up professional emails is a pain the ass. Setting up a working smtp is even more cumbersome.

What worked in the end is an email sending provider that has APIs to send mails. I finally managed to send emails via APIs provided by coresender.


If you still wish to try to go with the SMTP method, below you can find my findings:

Here are some facts that I wished I'd known when I started this:
- If you purchase a domain and an email hosting service,
and you change the DNS for the domain (to point to digitalocean, or aws, or whatever), you'll need to set up some mx records in the cloud's DNS records (DO, AWS, g Cloud, etc).
- Domain.com works fine for both the domain purchasing, and the professional email setup with G suite. It accepts paypal as well!


The following instructions helped with this:
To point the emails to us firstly you have to setup A records as:
mx.showyourplace.xyz pointing to 66.96.140.142
mx.showyourplace.xyz pointing to 66.96.140.143 
Then add MX records as:
Priority: 30
Host: *
Destination:  mx.showyourplace.xyz
	
Priority: 30
Host: @
Destination:  mx.showyourplace.xyz


Check if necessary ports are open:
nmap -p 25,465 <ipaddress, or website address>
