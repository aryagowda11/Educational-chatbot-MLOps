# Command to deploy the function

**Note: Only run this command once you are sure the update is working.**

Deployment for cloud function gen1

```
gcloud functions deploy process-video \
    --gen1 \
    --runtime python39 \
    --trigger-bucket graid-course \
    --region us-east4 \
    --memory 8192MB \
    --timeout 540s \
    --env-vars-file .env.yaml

```

We use gen1 for cloud function because of easy logging and debugging.

Deployment for cloud function gen2 that is cloud run

```bash
gcloud functions deploy process-video-1 \
    --gen2 \
    --runtime python39 \
    --trigger-bucket graid-courses \
    --region us-east4 \
    --memory 8192MB \
    --timeout 540s \
    --env-vars-file .env.yaml \
    --entry-point process_event \
    --min-instances 0 \
    --max-instances 1
```
