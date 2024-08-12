resource "aws_codestarconnections_connection" "codestar_connection" {
  name          = "app-dev-codestar"
  provider_type = "GitHub"
}

resource "aws_codepipeline" "codepipeline" {
  name     = "tf-test-pipeline"
  role_arn = aws_iam_role.codepipeline_role.arn

  artifact_store {
    location = aws_s3_bucket.codepipeline_bucket.bucket
    type     = "S3"
  }

  stage {
    name = "Source"
    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source_output"]
      configuration = {
        ConnectionArn    = aws_codestarconnections_connection.codestar_connection.arn
        FullRepositoryId = var.github_repository_url 
        BranchName       = "main"
      }
    }
  }

  stage {
    name = "Build"

    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      output_artifacts = ["build_output"]
      version          = "1"

      configuration = {
        ProjectName = "event-website"
      }
    }
  }
}

resource "aws_s3_bucket" "codepipeline_bucket" {
  bucket = var.codepipeline_bucket_name
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["codepipeline.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "codepipeline_role" {
  name               = "codepipe-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "aws_iam_policy_document" "codepipeline_policy" {
  statement {
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:GetObjectVersion",
      "s3:GetBucketVersioning",
      "s3:PutObjectAcl",
      "s3:PutObject",
    ]

    resources = [
      aws_s3_bucket.codepipeline_bucket.arn,
      "${aws_s3_bucket.codepipeline_bucket.arn}/*"
    ]
  }

  statement {
    actions = [
      "codestar-connections:UseConnection"
    ]

    resources = [
      "*",
    ]
  }

  statement {
    effect = "Allow"

    actions = [
      "codebuild:BatchGetBuilds",
      "codebuild:StartBuild",
    ]

    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "codepipeline_policy" {
  name   = "codepipeline_policy"
  role   = aws_iam_role.codepipeline_role.id
  policy = data.aws_iam_policy_document.codepipeline_policy.json
}

resource "aws_codebuild_project" "translate" {
  name         = "event-website"
  service_role = aws_iam_role.codebuild.arn

  artifacts {
    type = "CODEPIPELINE"
  }
  
  environment {
    compute_type = "BUILD_LAMBDA_2GB"
    image        = "aws/codebuild/amazonlinux-x86_64-lambda-standard:python3.12"
    type         = "LINUX_LAMBDA_CONTAINER"
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = file("buildspec.yml")
  }
}

resource "aws_iam_role" "codebuild" {
  name        = "CodeBuild_SSO_Permission_Sets_Provision_Role"

  assume_role_policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Effect" : "Allow",
          "Principal" : {
            "Service" : "codebuild.amazonaws.com"
          },
          "Action" : "sts:AssumeRole"
        }
      ]
    }
  )

  inline_policy {
    name = "codebuild_execute_policy"
    policy = data.aws_iam_policy_document.codebuild.json
  }
}

data "aws_iam_policy_document" "codebuild" {
  statement {
    sid = "SSOCodebuildAllow"

    actions = [
      "s3:*"
    ]

    resources = [
      aws_s3_bucket.english-bucket.arn,
      "${aws_s3_bucket.english-bucket.arn}/*",
      aws_s3_bucket.spanish-bucket.arn,
      "${aws_s3_bucket.spanish-bucket.arn}/*",  
      aws_s3_bucket.codepipeline_bucket.arn,
      "${aws_s3_bucket.codepipeline_bucket.arn}/*"
    ]
  }

statement {
    actions = [
      "translate:TranslateDocument"
    ]

    resources = [
      "*",
    ]
  }

  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = [
      "*",
    ]
  }
}
