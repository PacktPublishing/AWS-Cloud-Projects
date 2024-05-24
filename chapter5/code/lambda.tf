provider "aws" {
  region = "us-east-1"
}

resource "aws_iam_role" "lambda_role" {
    name   = "Detection_Lambda_Function_Role"
    assume_role_policy = <<EOF
    {
    "Version": "2012-10-17",
    "Statement": [
    {
        "Action": "sts:AssumeRole",
        "Principal": {
        "Service": "lambda.amazonaws.com"
        },
        "Effect": "Allow",
        "Sid": ""
    }
    ]
    }
    EOF
}

resource "aws_iam_policy" "iam_policy_for_lambda" {
 
    name         = "aws_iam_policy_for_terraform_aws_lambda_role"
    path         = "/"
    description  = "AWS IAM Policy for lambda role"
    policy = <<EOF
    {
    "Version": "2012-10-17",
    "Statement": [
    {
        "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
        ],
        "Resource": "arn:aws:logs:*:*:*",
        "Effect": "Allow"
    }
    ]
    }
    EOF
}

resource "aws_iam_role_policy_attachment" "attach_iam_policy_to_iam_role" {
    role        = aws_iam_role.lambda_role.name
    policy_arn  = aws_iam_policy.iam_policy_for_lambda.arn
}

data "aws_iam_policy" "rekognition_policy" {
  arn = "arn:aws:iam::aws:policy/AmazonRekognitionReadOnlyAccess"
}

resource "aws_iam_role_policy_attachment" "codedeploy_service_role_policy_attach" {
   role        = aws_iam_role.lambda_role.name
   policy_arn = "${data.aws_iam_policy.rekognition_policy.arn}"
}

data "archive_file" "zip_the_python_code" {
    type        = "zip"
    source_file  = "${path.module}/python/rekognition.py"
    output_path = "${path.module}/python/rekognition.zip"
}

resource "aws_lambda_function" "terraform_lambda_func" {
    filename                       = "${path.module}/python/rekognition.zip"
    function_name                  = "Detection_Lambda_Function"
    role                           = aws_iam_role.lambda_role.arn
    handler                        = "rekognition.lambda_handler"
    runtime                        = "python3.8"
    depends_on                     = [aws_iam_role_policy_attachment.attach_iam_policy_to_iam_role]
}
