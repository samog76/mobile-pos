# AWS artifacts

This Terraform creates an SQS queue for async jobs and is intended to be used alongside EKS deployment of `infra/k8s` manifests.

## Usage

```bash
cd infra/aws
terraform init
terraform apply
```
