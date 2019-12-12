from django.urls import include, path

from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from api import views
from api.views import LogoutView
router = routers.DefaultRouter()

router.register(r'quotes', views.QuoteViewSet)
router.register(r'rate', views.RateView)


app_name = 'api'

urlpatterns = [

    path('', include(router.urls)),
    path('login/', obtain_auth_token, name='api_token_auth'),
    path('logout/', LogoutView.as_view(), name='logout'),

]