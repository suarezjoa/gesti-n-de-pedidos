# Gestión de Pedidos - Despliegue en Kubernetes

Este proyecto consiste en una aplicación de gestión de pedidos desplegada en Kubernetes utilizando Minikube. La aplicación está compuesta por un frontend y un backend, cada uno desplegado en contenedores Docker.

## Requisitos Previos

- Docker Desktop instalado
- Minikube instalado
- kubectl instalado
- Git instalado

## Configuración del Cluster Kubernetes

### 1. Iniciar Minikube con Docker como driver
```bash
minikube start --driver=docker
```
Este comando inicia un cluster de Kubernetes local utilizando Docker como driver. Docker es el entorno de ejecución que se utilizará para los contenedores.

### 2. Agregar nodos trabajadores
```bash
minikube node add
```
Este comando agrega un nodo trabajador adicional al cluster. En nuestro caso, agregamos dos nodos trabajadores para tener un total de tres nodos (1 control plane + 2 workers).

### 3. Verificar el estado del cluster
```bash
minikube status
```
Este comando muestra el estado actual del cluster, incluyendo los nodos y sus componentes (kubelet, apiserver, etc.).

## Estructura del Proyecto

```
.
├── k8s/
│   ├── backend-deployment.yaml    # Manifiesto para el backend
│   └── frontend-deployment.yaml   # Manifiesto para el frontend
├── client/                        # Código del frontend
├── server.js                      # Código del backend
└── Dockerfile                     # Configuración de Docker
```

## Despliegue de la Aplicación

### 1. Crear el namespace
```bash
kubectl create namespace gestion-pedidos
```
Este comando crea un namespace aislado para nuestra aplicación. Los namespaces en Kubernetes permiten dividir los recursos del cluster entre múltiples usuarios o proyectos.

### 2. Desplegar el Backend
```bash
kubectl apply -f k8s/backend-deployment.yaml
```
Este comando aplica el manifiesto del backend que:
- Crea un Deployment con 2 réplicas del backend
- Configura los recursos (CPU y memoria) para cada pod
- Expone el servicio en el puerto 3001 como ClusterIP

### 3. Desplegar el Frontend
```bash
kubectl apply -f k8s/frontend-deployment.yaml
```
Este comando aplica el manifiesto del frontend que:
- Crea un Deployment con 2 réplicas del frontend
- Configura los recursos (CPU y memoria) para cada pod
- Expone el servicio en el puerto 80 como LoadBalancer

### 4. Verificar el estado del despliegue
```bash
kubectl get all -n gestion-pedidos
```
Este comando muestra todos los recursos creados en el namespace:
- Pods: Contenedores en ejecución
- Deployments: Controladores que mantienen el número deseado de pods
- Services: Endpoints para acceder a la aplicación
- ReplicaSets: Controladores que aseguran el número correcto de réplicas

## Acceso a la Aplicación

### Frontend
```bash
minikube service frontend-pedidos-service -n gestion-pedidos
```
Este comando:
1. Expone el servicio frontend al host local
2. Abre automáticamente el navegador con la URL correcta
3. Crea un túnel para acceder al servicio desde fuera del cluster

### Backend
El backend es accesible internamente a través del servicio `backend-pedidos-service` en el puerto 3001. Para acceder desde fuera del cluster, se puede usar port-forwarding:

```bash
kubectl port-forward service/backend-pedidos-service 3001:3001 -n gestion-pedidos
```

## Monitoreo y Mantenimiento

### Ver logs de los pods
```bash
kubectl logs -f <nombre-del-pod> -n gestion-pedidos
```

### Escalar el número de réplicas
```bash
kubectl scale deployment backend-pedidos --replicas=3 -n gestion-pedidos
```

### Eliminar recursos
```bash
kubectl delete namespace gestion-pedidos
```
Este comando elimina todos los recursos creados en el namespace.

## Consideraciones Importantes

1. **Recursos**: Los pods están configurados con límites de recursos para evitar el consumo excesivo de CPU y memoria.
2. **Alta Disponibilidad**: El uso de múltiples réplicas asegura que la aplicación siga funcionando incluso si un pod falla.
3. **Escalabilidad**: La aplicación puede escalarse horizontalmente aumentando el número de réplicas.
4. **Aislamiento**: El uso de namespaces proporciona aislamiento y organización de los recursos.

## Solución de Problemas

Si encuentras problemas al acceder a la aplicación:

1. Verifica que todos los pods estén en estado "Running":
```bash
kubectl get pods -n gestion-pedidos
```

2. Revisa los logs de los pods:
```bash
kubectl logs <nombre-del-pod> -n gestion-pedidos
```

3. Verifica los servicios:
```bash
kubectl get services -n gestion-pedidos
```

4. Asegúrate de que Minikube esté corriendo:
```bash
minikube status
``` 