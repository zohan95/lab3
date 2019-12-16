from django.urls import include, path

from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from api import views
from api.views import LogoutView, RateView

router = routers.DefaultRouter()

router.register(r'quotes', views.QuoteViewSet)

app_name = 'api'

urlpatterns = [

    path('', include(router.urls)),
    path('login/', obtain_auth_token, name='api_token_auth'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('rate/<int:pk>/', RateView.as_view())
]
