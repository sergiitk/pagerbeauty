# PagerBeauty on AWS

## Deploying using CloudFormation template

1. Save latest [`pagerbeauty.cloudformation`](https://raw.githubusercontent.com/sergiitk/pagerbeauty/master/.aws/pagerbeauty.cloudformation) template
2. Open [CloudFormation](https://console.aws.amazon.com/cloudformation) in AWS Management Console
3. Create stack ➡ With new resources (standard)
4. On Create stack page: Specify template ➡ Upload a template file ➡ Upload a template file ➡ Open saved `pagerbeauty.cloudformation`
5. On Parameters Page:
   - Fill in Stack Name, f.e. "PagerBeauty"
   - Select your Key Name for SSH access
   - Fill in "Pager Beauty: Settings" as guided
   - Fill in "Pager Beauty: Enable HTTP Authentication (Optional)" if necessary
   - Click Next
6. Configure stack options ➡ Click Next
7. Review ➡ Create Stack
8. When stack creation is complete, open tab "Resources" click "Physical ID" next to "PagerBeauty" to proceed to EC2 management
9. In your browser, open URL listed in "Public DNS (IPv4)" for the selected EC2 instance

## Changing configuration

1. Log into the instance with ssh `ssh ec2-user@public-dns.amazonaws.com`
2. Use your favorite editor to update .env file, f.e. `sudo vim /opt/pagerbeauty/app/.env`
3. `sudo service pm2-pagerbeauty restart`

### Debugging
```sh
cd /opt/pagerbeauty/app/
sudo -su pagerbeauty
pm2 status
pm2 help
```
### Other
* View logs: `sudo -u pagerbeauty pm2 logs pagerbeauty`
