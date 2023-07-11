const k8s = require('@kubernetes/client-node');
const crypto = require('crypto');

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

async function submitWorkflow(userId, orderId, imageName) {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);

    const body = {
        "apiVersion": "argoproj.io/v1alpha1",
        "kind": "Workflow",
        "metadata": {
            "name": `pypsa-workflow-${uuidv4()}`
        },
        "spec": {
            "serviceAccountName": "pypsa-argo",
            "entrypoint": "main",
            "arguments": {
            "parameters": [
                {
                    "name": "pypsa_image_path",
                    "value": imageName
                },
                {
                    "name": "run_folder_name",
                    "value": `${userId}/${orderId}`
                },
                {
                    "name": "run_order_id",
                    "value": orderId
                }
            ]
            },
            "templates": [
                {
                    "name": "main",
                    "steps": [
                        [
                            {
                                "name": "pypsa-workflow",
                                "templateRef": {
                                    "name": "pypsa-workflow-template",
                                    "template": "pypsa-workflow"
                                }
                            }
                        ]
                    ]
                }
            ]
        }
    }
    await k8sApi.createNamespacedCustomObject("argoproj.io", "v1alpha1", "default", "workflows", body)
}

module.exports = {
    submitWorkflow
}