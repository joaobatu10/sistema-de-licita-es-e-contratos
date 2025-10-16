import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Skeleton,
  Divider,
  CardActionArea,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import dayjs from "dayjs";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// ======= helpers
const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // ajuste se necessário
});

function StatCard({ title, value, icon, color, onClick }) {
  return (
    <Card sx={{ 
      height: "100%", 
      borderRadius: 3, 
      cursor: onClick ? "pointer" : "default",
      boxShadow: 3,
      background: `linear-gradient(135deg, ${
        color === 'primary' ? '#1976d2' : 
        color === 'success' ? '#2e7d32' :
        color === 'info' ? '#0288d1' :
        '#ed6c02'
      } 0%, rgba(255,255,255,0.9) 100%)`,
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: onClick ? 'translateY(-4px)' : 'none',
        boxShadow: onClick ? 6 : 3
      }
    }}>
      <CardActionArea onClick={onClick} disabled={!onClick}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.9)',
                color: `${color}.main`,
                display: "grid",
                placeItems: "center",
                boxShadow: 2,
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography variant="body2" color="rgba(0,0,0,0.7)" fontWeight={500}>
                {title}
              </Typography>
              <Typography variant="h5" fontWeight={700} color="#fff">
                {value}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [kpis, setKpis] = React.useState({
    licitacoes: 0,
    contratos: 0,
    usuarios: 0,
    notificacoes: 0,
  });
  const [ultimas, setUltimas] = React.useState([]);
  const [serie, setSerie] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      try {
        const [lics, cons, users, notifs] = await Promise.all([
          api.get("/licitacoes/"),
          api.get("/contratos/").catch(() => ({ data: [] })),
          api.get("/usuarios/").catch(() => ({ data: [] })),
          api.get("/notificacoes/?apenas_nao_lidas=true").catch(() => ({ data: [] })),
        ]);

        if (!mounted) return;

        const licitacoes = lics.data || [];
        const contratos = cons.data || [];
        const usuarios = users.data || [];
        const notificacoes = notifs.data || [];

        // KPIs
        setKpis({
          licitacoes: licitacoes.length,
          contratos: contratos.length,
          usuarios: usuarios.length,
          notificacoes: notificacoes.length,
        });

        // Últimas licitações (5)
        const ult = [...licitacoes]
          .sort((a, b) => new Date(b.data_abertura) - new Date(a.data_abertura))
          .slice(0, 5);
        setUltimas(ult);

        // Série mensal (contagem por mês do ano corrente)
        const year = dayjs().year();
        const counts = Array.from({ length: 12 }, (_, m) => ({
          mes: dayjs().month(m).format("MMM"),
          total: 0,
        }));
        licitacoes.forEach((l) => {
          const d = dayjs(l.data_abertura);
          if (d.year() === year) counts[d.month()].total += 1;
        });
        setSerie(counts);
      } catch (e) {
        // fallback demo
        setKpis({ licitacoes: 0, contratos: 0, usuarios: 0, notificacoes: 0 });
        setUltimas([]);
        setSerie(
          Array.from({ length: 12 }, (_, m) => ({
            mes: dayjs().month(m).format("MMM"),
            total: 0,
          }))
        );
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="bold" mb={1} sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        backgroundClip: 'text',
        color: 'transparent',
        display: 'inline-block'
      }}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4} sx={{ fontSize: '1.1rem' }}>
        Visão geral do sistema de monitoramento de licitações e contratos.
      </Typography>

      {/* KPIs */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rounded" height={110} />
          ) : (
            <StatCard
              title="Licitações"
              value={kpis.licitacoes}
              color="primary"
              icon={<AssessmentIcon color="primary" />}
              onClick={() => navigate("/licitacoes")}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rounded" height={110} />
          ) : (
            <StatCard
              title="Contratos"
              value={kpis.contratos}
              color="success"
              icon={<AssignmentIcon color="success" />}
              onClick={() => navigate("/contratos")}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rounded" height={110} />
          ) : (
            <StatCard
              title="Usuários"
              value={kpis.usuarios}
              color="info"
              icon={<PeopleAltIcon color="info" />}
              onClick={() => navigate("/usuarios")}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rounded" height={110} />
          ) : (
            <StatCard
              title="Notificações"
              value={kpis.notificacoes}
              color="warning"
              icon={<NotificationsActiveIcon color="warning" />}
              onClick={() => navigate("/notificacoes")}
            />
          )}
        </Grid>

        {/* Gráfico */}
        <Grid item xs={12} md={7}>
          <Card sx={{ 
            borderRadius: 3, 
            height: 400, 
            overflow: 'hidden',
            boxShadow: 3,
            background: 'linear-gradient(135deg, #fff 0%, #f8faff 100%)'
          }}>
            <CardContent sx={{ height: "100%", position: 'relative' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  📊 Licitações por mês ({dayjs().year()})
                </Typography>
                <Chip 
                  label={`Total: ${serie.reduce((acc, item) => acc + item.total, 0)}`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
              
              {loading ? (
                <Skeleton variant="rounded" height={300} />
              ) : (
                <Box sx={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={serie}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                          <stop offset="50%" stopColor="#42a5f5" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#90caf9" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#1976d2" />
                          <stop offset="50%" stopColor="#42a5f5" />
                          <stop offset="100%" stopColor="#64b5f6" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="#e0e0e0"
                        strokeOpacity={0.5}
                      />
                      <XAxis 
                        dataKey="mes" 
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        allowDecimals={false}
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 'dataMax + 1']}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          fontSize: '14px'
                        }}
                        labelStyle={{ color: '#333', fontWeight: 'bold' }}
                        formatter={(value, name) => [
                          `${value} licitação${value !== 1 ? 'ões' : ''}`,
                          'Total'
                        ]}
                        labelFormatter={(label) => `Mês: ${label}`}
                        cursor={{ stroke: '#1976d2', strokeWidth: 2, strokeDasharray: '5 5' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="url(#strokeGradient)"
                        strokeWidth={3}
                        fill="url(#colorTotal)"
                        dot={{ 
                          fill: '#1976d2', 
                          stroke: '#fff', 
                          strokeWidth: 2, 
                          r: 5,
                          style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }
                        }}
                        activeDot={{ 
                          r: 8, 
                          fill: '#1976d2',
                          stroke: '#fff',
                          strokeWidth: 3,
                          style: { filter: 'drop-shadow(0 2px 8px rgba(25,118,210,0.4))' }
                        }}
                        animationDuration={2000}
                        animationEasing="ease-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              )}
              
              {/* Estatísticas adicionais */}
              <Box sx={{ 
                position: 'absolute', 
                bottom: 16, 
                right: 16,
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap'
              }}>
                <Chip 
                  label={`Maior: ${Math.max(...serie.map(s => s.total))}`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
                <Chip 
                  label={`Média: ${(serie.reduce((acc, item) => acc + item.total, 0) / 12).toFixed(1)}`}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráficos complementares */}
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            {/* Status das Licitações */}
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: 3,
              background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)'
            }}>
              <CardContent>
                <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
                  📈 Insights do Mês
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ 
                    p: 3, 
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    color: 'white',
                    borderRadius: 3,
                    textAlign: 'center',
                    boxShadow: 2
                  }}>
                    <Typography variant="h4" fontWeight="bold">
                      {serie[dayjs().month()]?.total || 0}
                    </Typography>
                    <Typography variant="body2">
                      Licitações este mês ({dayjs().format('MMM')})
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    p: 3, 
                    background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                    color: 'white',
                    borderRadius: 3,
                    textAlign: 'center',
                    boxShadow: 2
                  }}>
                    <Typography variant="h4" fontWeight="bold">
                      {Math.max(...serie.map(s => s.total))}
                    </Typography>
                    <Typography variant="body2">
                      Pico do ano
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    p: 3, 
                    background: 'linear-gradient(135deg, #0288d1 0%, #4fc3f7 100%)',
                    color: 'white',
                    borderRadius: 3,
                    textAlign: 'center',
                    boxShadow: 2
                  }}>
                    <Typography variant="h4" fontWeight="bold">
                      {(serie.reduce((acc, item) => acc + item.total, 0) / 12).toFixed(1)}
                    </Typography>
                    <Typography variant="body2">
                      Média mensal
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Mini gráfico de progresso */}
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
            }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  🎯 Progresso Anual
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['1º Trim', '2º Trim', '3º Trim', '4º Trim'].map((trimestre, index) => {
                    const startMonth = index * 3;
                    const trimTotal = serie.slice(startMonth, startMonth + 3).reduce((acc, item) => acc + item.total, 0);
                    const maxTrim = 15; // Assumindo um máximo de 15 por trimestre
                    const percentage = (trimTotal / maxTrim) * 100;
                    
                    return (
                      <Box key={trimestre}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">{trimestre}</Typography>
                          <Typography variant="body2" fontWeight="bold">{trimTotal}</Typography>
                        </Box>
                        <Box sx={{ 
                          height: 10, 
                          bgcolor: 'grey.200', 
                          borderRadius: 2,
                          overflow: 'hidden',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          <Box sx={{ 
                            height: '100%', 
                            width: `${Math.min(percentage, 100)}%`,
                            background: index === 0 ? 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)' : 
                                       index === 1 ? 'linear-gradient(90deg, #2e7d32 0%, #66bb6a 100%)' :
                                       index === 2 ? 'linear-gradient(90deg, #f57c00 0%, #ffb74d 100%)' : 
                                       'linear-gradient(90deg, #d32f2f 0%, #f28b82 100%)',
                            transition: 'width 1s ease-out',
                            borderRadius: 2,
                            boxShadow: 1
                          }} />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Últimas Licitações */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                  🔄 Últimas Licitações
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate("/licitacoes")}
                  startIcon={<AssessmentIcon />}
                >
                  Ver Todas
                </Button>
              </Box>

              {loading ? (
                <Stack spacing={2}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rounded" height={80} />
                  ))}
                </Stack>
              ) : ultimas.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AssessmentIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    Nenhuma licitação encontrada
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {ultimas.map((lic, index) => (
                    <Box
                      key={lic.id_licitacao || index}
                      sx={{
                        p: 3,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 3,
                        transition: 'all 0.2s ease',
                        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                        boxShadow: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: '0 4px 12px rgba(25,118,210,0.15)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => navigate(`/licitacoes?id=${lic.id_licitacao || index + 1}`)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            {lic.numero_processo || `Licitação ${index + 1}`}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            {lic.objeto || 'Objeto não informado'}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip 
                              label={lic.modalidade || 'N/A'}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip 
                              label={lic.status || 'Em andamento'}
                              size="small"
                              color={
                                lic.status?.toLowerCase().includes('conclu') ? 'success' :
                                lic.status?.toLowerCase().includes('cancel') ? 'error' :
                                'warning'
                              }
                            />
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="textSecondary">
                            {dayjs(lic.data_abertura).format('DD/MM/YYYY')}
                          </Typography>
                          <Typography variant="body2" color="primary.main" fontWeight={600}>
                            {lic.orgao_responsavel || 'Órgão não informado'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};